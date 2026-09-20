import assert from "node:assert/strict";
import { test } from "node:test";
import { createConfig } from "../src/config.ts";

test("development uses API_PORT and defaults to port 5001", () => {
  assert.deepEqual(createConfig({}, true), {
    development: true,
    port: 5001,
    host: "0.0.0.0",
  });

  assert.equal(createConfig({ API_PORT: "5100" }, true).port, 5100);
});

test("production uses PORT and defaults to port 3000", () => {
  assert.equal(createConfig({}, false).port, 3000);
  assert.equal(createConfig({ PORT: "8080" }, false).port, 8080);
});

test("configuration reads the host", () => {
  assert.equal(createConfig({ HOST: "127.0.0.1" }, true).host, "127.0.0.1");
});

for (const value of ["", "3.14", "0", "65536", "not-a-port"]) {
  test(`configuration rejects invalid port ${JSON.stringify(value)}`, () => {
    assert.throws(
      () => createConfig({ API_PORT: value }, true),
      /API_PORT must be an integer between 1 and 65535/,
    );
  });
}
