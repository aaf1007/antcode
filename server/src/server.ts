import { config } from "./config.ts";
import app from "./app.ts";
import { closeAuthPool } from "./auth/auth.ts";
import { db } from "./db/prisma/db.ts";

const server = app.listen(config.port, config.host, () => {
  console.log(`AntCode API listening on http://localhost:${config.port}`);
});

server.on("error", (error) => {
  console.error("Failed to start AntCode", error);
  process.exit(1);
});

let shuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}; shutting down AntCode API`);
  // Force exit if a slow request or pool keeps shutdown from finishing.
  setTimeout(() => process.exit(1), 10_000).unref();
  // Stop accepting connections and wait for in-flight requests before closing the pools.
  await new Promise<void>((resolve) => {
    server.close((error) => {
      if (error) console.error("Failed to close HTTP server", error);
      resolve();
    });
    server.closeIdleConnections();
  });
  const results = await Promise.allSettled([closeAuthPool(), db.close()]);
  for (const result of results) {
    if (result.status === "rejected") console.error("Failed to close database pool", result.reason);
  }
  process.exit(results.some((result) => result.status === "rejected") ? 1 : 0);
}

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
