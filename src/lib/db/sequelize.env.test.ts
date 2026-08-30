import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const tsxPreload = pathToFileURL(require.resolve("tsx")).href;
const sequelizeModule = pathToFileURL(resolve("src/lib/db/sequelize.ts")).href;
const databaseName = "task2_env_regression_database";

test("loads DB_NAME from the standalone working directory before Sequelize construction", async () => {
  const directory = await mkdtemp(resolve(tmpdir(), "antcode-sequelize-env-"));

  try {
    await writeFile(resolve(directory, ".env.local"), `DB_NAME=${databaseName}\n`);

    const childEnv: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "development" };
    delete childEnv.DB_NAME;
    delete childEnv.DB_USER;
    delete childEnv.DB_PASSWORD;
    delete childEnv.DB_HOST;
    delete childEnv.DB_PORT;

    const result = spawnSync(
      process.execPath,
      [
        "--import",
        tsxPreload,
        "--conditions=react-server",
        "--input-type=module",
        "--eval",
        `const { sequelize } = await import(${JSON.stringify(sequelizeModule)}); process.stdout.write(sequelize.getDatabaseName());`,
      ],
      { cwd: directory, encoding: "utf8", env: childEnv },
    );

    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, databaseName);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
