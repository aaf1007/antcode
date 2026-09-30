import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const authModule = new URL("../../src/auth/auth.ts", import.meta.url).href;
const validSecret = "test-only-better-auth-secret-000000000000";

// Prints the resolved schema-check setting, then exits before any pending database check completes.
const printValidateSchema = `.then(({ auth }) => {
  console.log(JSON.stringify(auth.options.advanced.database.validateSchema));
  process.exit(0);
})`;

function loadAuthWith(environment: Record<string, string | undefined>, then = "") {
  return spawnSync(process.execPath, ["--import", "tsx", "-e", `import(${JSON.stringify(authModule)})${then}`], {
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://unused:unused@localhost:5433/unused",
      BETTER_AUTH_SECRET: validSecret,
      BETTER_AUTH_URL: "https://antcode.test",
      BETTER_AUTH_TRUSTED_ORIGINS: undefined,
      ...environment,
    },
  });
}

test("the public example secret cannot start Better Auth", () => {
  const result = loadAuthWith({ BETTER_AUTH_SECRET: "replace-with-a-random-secret-of-at-least-32-characters" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /BETTER_AUTH_SECRET must be a generated secret/);
});

test("production auth requires an HTTPS browser origin", () => {
  const result = loadAuthWith({ BETTER_AUTH_URL: "http://antcode.test" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /BETTER_AUTH_URL must use HTTPS in production/);
});

for (const NODE_ENV of ["production", "development"]) {
  test(`extra trusted origins are rejected in ${NODE_ENV}`, () => {
    const result = loadAuthWith({ NODE_ENV, BETTER_AUTH_TRUSTED_ORIGINS: "https://evil.test" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /BETTER_AUTH_TRUSTED_ORIGINS is not supported/);
  });
}

test("production ignores the schema-check skip", () => {
  const result = loadAuthWith({ BETTER_AUTH_SKIP_SCHEMA_CHECK: "1" }, printValidateSchema);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "true");
});

test("tests may skip the schema check outside production", () => {
  const result = loadAuthWith({ NODE_ENV: "test", BETTER_AUTH_SKIP_SCHEMA_CHECK: "1" }, printValidateSchema);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "false");
});
