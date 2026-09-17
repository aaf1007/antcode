import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

test("development server defaults to port 5001", async (t) => {
  const originalArgv = process.argv;
  const originalApiPort = process.env.API_PORT;
  const originalDotenvPath = process.env.DOTENV_CONFIG_PATH;

  t.after(() => {
    process.argv = originalArgv;
    if (originalApiPort === undefined) delete process.env.API_PORT;
    else process.env.API_PORT = originalApiPort;
    if (originalDotenvPath === undefined) delete process.env.DOTENV_CONFIG_PATH;
    else process.env.DOTENV_CONFIG_PATH = originalDotenvPath;
  });

  process.argv = [...originalArgv, "--dev"];
  delete process.env.API_PORT;
  process.env.DOTENV_CONFIG_PATH = fileURLToPath(new URL("fixtures/missing.env", import.meta.url));

  const { config } = await import("../src/config.ts");

  assert.equal(config.development, true);
  assert.equal(config.port, 5001);
});
