import assert from "node:assert/strict";
import { test } from "node:test";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { Pool } from "pg";

const baseURL = process.env.BETTER_AUTH_URL;
const databaseURL = process.env.AUTH_TEST_DATABASE_URL;
if (!baseURL || !databaseURL) throw new Error("Set BETTER_AUTH_URL and AUTH_TEST_DATABASE_URL for auth integration tests.");
const databaseName = decodeURIComponent(new URL(databaseURL).pathname.slice(1));
if (!/(^|_)auth_test(_|$)/.test(databaseName)) {
  throw new Error("AUTH_TEST_DATABASE_URL must name a dedicated auth_test database.");
}
process.env.DATABASE_URL = databaseURL;
const { auth } = await import("../src/auth/auth.ts");
const { default: app } = await import("../src/app.ts");
const origin = new URL(baseURL).origin;
const testIp = `198.51.${process.pid % 250}.${Math.floor(Math.random() * 250) + 1}`;

async function request(path: string, body?: Record<string, unknown>, cookie?: string, requestOrigin = origin, ip = testIp) {
  return auth.handler(new Request(`${origin}/api/auth${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "content-type": "application/json", origin: requestOrigin } : {}),
      ...(cookie ? { cookie } : {}),
      "x-forwarded-for": ip,
    },
    body: body ? JSON.stringify(body) : undefined,
  }));
}

function sessionCookie(response: Response) {
  const cookie = response.headers.getSetCookie().find((item) => item.includes("better-auth.session_token="));
  assert.ok(cookie, "expected a session cookie");
  return cookie.split(";", 1)[0];
}

test("registration, login, fixed session, revocation, and origin protection", async () => {
  const pool = new Pool({ connectionString: databaseURL });
  try {
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const email = `auth_${unique}@example.test`;
    const username = `User_${unique}`.slice(0, 30);
    const password = "correct horse battery staple";

    const missingUsername = await request("/sign-up/email", { name: "Someone", email: `missing_${unique}@example.test`, password });
    assert.equal(missingUsername.status, 400);

    const signUp = await request("/sign-up/email", { name: "Wrong Name", displayUsername: "admin", username, email, password });
    assert.equal(signUp.status, 200, await signUp.text());
    const firstCookie = sessionCookie(signUp);
    assert.match(signUp.headers.get("set-cookie") ?? "", /HttpOnly/i);
    if (process.env.NODE_ENV === "production") assert.match(signUp.headers.get("set-cookie") ?? "", /Secure/i);

    const userRow = await pool.query('select "name", "username", "displayUsername", "image" from auth."user" where "email" = $1', [email]);
    assert.equal(userRow.rows[0].name, username);
    assert.equal(userRow.rows[0].displayUsername, username);
    assert.equal(userRow.rows[0].image, null);
    assert.equal(userRow.rows[0].username, username.toLowerCase());
    const sessionRow = await pool.query('select s."expiresAt", s."createdAt" from auth."session" s join auth."user" u on u."id" = s."userId" where u."email" = $1', [email]);
    const lifetime = (sessionRow.rows[0].expiresAt as Date).getTime() - (sessionRow.rows[0].createdAt as Date).getTime();
    assert.ok(Math.abs(lifetime - 7 * 24 * 60 * 60 * 1000) < 5000, `session lifetime ${lifetime}`);

    const current = await request("/get-session", undefined, firstCookie);
    assert.equal((await current.json() as { user: { email: string } }).user.email, email);
    const unchangedExpiry = await pool.query('select s."expiresAt" from auth."session" s join auth."user" u on u."id" = s."userId" where u."email" = $1', [email]);
    assert.equal((unchangedExpiry.rows[0].expiresAt as Date).getTime(), (sessionRow.rows[0].expiresAt as Date).getTime());
    const duplicateEmail = await request("/sign-up/email", { name: username, username: `other_${unique}`.slice(0, 30), email, password });
    assert.ok(duplicateEmail.status >= 400);
    const duplicateUsername = await request("/sign-up/email", { name: username, username: username.toUpperCase(), email: `other_${unique}@example.test`, password });
    assert.equal(duplicateUsername.status, 400);
    assert.equal((await duplicateUsername.json() as { code: string }).code, "USERNAME_IS_ALREADY_TAKEN");

    for (const field of [{ name: "Someone Else" }, { displayUsername: "admin" }, { image: "https://example.test/a.png" }]) {
      const update = await request("/update-user", field, firstCookie);
      assert.equal(update.status, 400, `update-user accepted ${Object.keys(field)[0]}`);
    }
    const afterUpdates = await pool.query('select "name", "displayUsername", "image" from auth."user" where "email" = $1', [email]);
    assert.deepEqual(afterUpdates.rows[0], { name: username, displayUsername: username, image: null });

    const signOut = await request("/sign-out", {}, firstCookie);
    assert.equal(signOut.status, 200);
    const afterSignOut = await request("/get-session", undefined, firstCookie);
    assert.equal(await afterSignOut.json(), null);

    const wrongPassword = await request("/sign-in/username", { username, password: "wrong password" });
    assert.ok(wrongPassword.status >= 400);
    const byUsername = await request("/sign-in/username", { username: username.toLowerCase(), password });
    assert.equal(byUsername.status, 200, await byUsername.text());
    const usernameCookie = sessionCookie(byUsername);
    assert.equal((await (await request("/get-session", undefined, usernameCookie)).json() as { user: { email: string } }).user.email, email);

    const byEmail = await request("/sign-in/email", { email, password });
    assert.equal(byEmail.status, 200, await byEmail.text());
    const emailCookie = sessionCookie(byEmail);
    await pool.query('update auth."session" set "expiresAt" = now() - interval \'1 second\' where "userId" = (select "id" from auth."user" where "email" = $1)', [email]);
    const expired = await request("/get-session", undefined, emailCookie);
    assert.equal(await expired.json(), null);

    const badOrigin = await request("/sign-up/email", { name: "Evil", username: `evil_${unique}`.slice(0, 30), email: `evil_${unique}@example.test`, password }, undefined, "https://evil.example");
    assert.ok(badOrigin.status >= 400);
  } finally {
    await pool.end();
  }
});

test("sign-up rejects a profile image", async () => {
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const response = await request("/sign-up/email", {
    username: `img_${unique}`.slice(0, 30), email: `img_${unique}@example.test`, password: "password1234", image: "https://example.test/a.png",
  }, undefined, origin, `198.18.${process.pid % 250}.${Math.floor(Math.random() * 250) + 1}`);
  assert.equal(response.status, 400);
});

test("concurrent sign-ups for one username leave exactly one account and report the name as taken", async () => {
  const pool = new Pool({ connectionString: databaseURL });
  try {
    // Several rounds make it likely that at least one pair races past the plugin's pre-insert check.
    for (let round = 0; round < 5; round += 1) {
      const unique = `${Date.now()}_${round}_${Math.random().toString(36).slice(2, 6)}`;
      const name = `race_${unique}`.slice(0, 30);
      const responses = await Promise.all([0, 1, 2].map((index) => request("/sign-up/email", {
        username: name, email: `race_${index}_${unique}@example.test`, password: "password1234",
      }, undefined, origin, `198.19.${round}.${index + 1 + (process.pid % 200)}`)));
      assert.equal(responses.filter((response) => response.status === 200).length, 1);
      // The plugin's pre-insert check answers 400; a sign-up that loses the race to the unique index answers 422.
      for (const response of responses.filter((item) => item.status !== 200)) {
        assert.ok(response.status === 400 || response.status === 422, `status ${response.status}`);
        assert.equal((await response.json() as { code: string }).code, "USERNAME_IS_ALREADY_TAKEN");
      }
      const rows = await pool.query('select 1 from auth."user" where "username" = $1', [name.toLowerCase()]);
      assert.equal(rows.rowCount, 1);
    }
  } finally {
    await pool.end();
  }
});

test("sign-up rate limit is shared through the database", async () => {
  const ip = `203.0.${process.pid % 250}.${Math.floor(Math.random() * 250) + 1}`;
  const body = { name: "Missing username", email: "unused@example.test", password: "password1234" };
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await request("/sign-up/email", body, undefined, origin, ip);
    assert.equal(response.status, 400);
  }
  const limited = await request("/sign-up/email", body, undefined, origin, ip);
  assert.equal(limited.status, 429);
});

test("the Express auth route ignores a forwarded IP from an untrusted socket", async () => {
  const server = app.listen(0, "127.0.0.1");
  const pool = new Pool({ connectionString: databaseURL });
  try {
    await once(server, "listening");
    const spoofedIp = `203.0.113.${Math.floor(Math.random() * 250) + 1}`;
    const response = await fetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin, "x-forwarded-for": spoofedIp },
      body: JSON.stringify({ email: "proxy-test@example.test", password: "password1234" }),
    });
    assert.ok(response.status === 400 || response.status === 429);
    const spoofedKey = await pool.query('select 1 from auth."rateLimit" where "key" = $1', [`${spoofedIp}|/sign-up/email`]);
    assert.equal(spoofedKey.rowCount, 0);
    const socketKey = await pool.query('select 1 from auth."rateLimit" where "key" = $1', ["127.0.0.1|/sign-up/email"]);
    assert.equal(socketKey.rowCount, 1);
  } finally {
    await pool.end();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
