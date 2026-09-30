import "dotenv/config";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware, isAPIError } from "better-auth/api";
import { USERNAME_ERROR_CODES, username } from "better-auth/plugins/username";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
const exampleSecret = "replace-with-a-random-secret-of-at-least-32-characters";

if (!databaseUrl) throw new Error("DATABASE_URL is required for Better Auth.");
if (!secret || secret.length < 32 || secret === exampleSecret) {
  throw new Error("BETTER_AUTH_SECRET must be a generated secret of at least 32 characters.");
}
if (!baseURL) throw new Error("BETTER_AUTH_URL is required for Better Auth.");
// Better Auth appends this variable to trustedOrigins, which would silently widen origin checks.
if (process.env.BETTER_AUTH_TRUSTED_ORIGINS !== undefined) {
  throw new Error("BETTER_AUTH_TRUSTED_ORIGINS is not supported; BETTER_AUTH_URL is the only trusted origin.");
}

const authURL = new URL(baseURL);
if (process.env.NODE_ENV === "production" && authURL.protocol !== "https:") {
  throw new Error("BETTER_AUTH_URL must use HTTPS in production.");
}
const browserOrigin = authURL.origin;
// The schema check may be skipped only by database-free tests, never in production.
const skipSchemaCheck = process.env.NODE_ENV !== "production"
  && process.env.BETTER_AUTH_SKIP_SCHEMA_CHECK === "1";
export const trustedProxies = process.env.BETTER_AUTH_TRUSTED_PROXIES
  ?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];

const pool = new Pool({ connectionString: databaseUrl });
// Without a listener, an error on an idle client (e.g. a database restart) crashes the process.
pool.on("error", (error) => {
  console.error("Better Auth database pool error", error);
});

export function closeAuthPool() {
  return pool.end();
}

// Profile fields are derived from the username; there is no profile editing.
const lockedProfileFields = ["name", "displayUsername", "image"] as const;

export const auth = betterAuth({
  baseURL: browserOrigin,
  secret,
  trustedOrigins: [browserOrigin],
  database: {
    dialect: new PostgresDialect({ pool }),
    type: "postgres",
    schemaName: "auth",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  plugins: [username({ immutableUsername: true })],
  session: {
    // A session ends seven days after sign-in even if the user stays active.
    expiresIn: 7 * 24 * 60 * 60,
    disableSessionRefresh: true,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/sign-up/email": { window: 60, max: 5 },
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-in/username": { window: 60, max: 10 },
    },
  },
  advanced: {
    database: { validateSchema: !skipSchemaCheck },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/update-user") {
        if (lockedProfileFields.some((field) => ctx.body?.[field] !== undefined)) {
          throw new APIError("BAD_REQUEST", { message: "Profile fields cannot be changed." });
        }
        return;
      }
      if (ctx.path !== "/sign-up/email") return;
      // The username plugin allows omission; AntCode requires it for registration.
      const submittedUsername = ctx.body?.username;
      if (typeof submittedUsername !== "string" || !submittedUsername.trim()) {
        throw new APIError("BAD_REQUEST", { message: "Username is required." });
      }
      if (ctx.body?.image !== undefined) {
        throw new APIError("BAD_REQUEST", { message: "Profile images are not supported." });
      }
      const trimmedUsername = submittedUsername.trim();
      // Better Auth merges this body over the request body after all before hooks run.
      return {
        context: {
          body: {
            username: trimmedUsername,
            name: trimmedUsername,
            displayUsername: trimmedUsername,
          },
        },
      };
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const returned = ctx.context.returned;
      if (!isAPIError(returned) || returned.body?.code !== "FAILED_TO_CREATE_USER") return;
      // Two concurrent sign-ups can both pass the plugin's username check; the loser then hits the
      // unique constraint and gets a generic error. Report it as the taken username it is. Better Auth
      // keeps the original 422 status for errors thrown here, so only the code and message change.
      const submittedUsername = ctx.body?.username;
      if (typeof submittedUsername !== "string") return;
      const existingUser = await ctx.context.adapter.findOne({
        model: "user",
        where: [{ field: "username", value: submittedUsername.toLowerCase() }],
      });
      if (existingUser) throw APIError.from("BAD_REQUEST", USERNAME_ERROR_CODES.USERNAME_IS_ALREADY_TAKEN);
    }),
  },
});
