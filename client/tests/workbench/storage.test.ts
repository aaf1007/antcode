import assert from "node:assert/strict";
import { test } from "node:test";
import { customInputKey, draftKey, readPersisted, writePersisted } from "../../src/features/workbench/storage.ts";

test("draft keys isolate problem and language pairs", () => {
  assert.equal(draftKey("two-sum", "python3"), "antcode:draft:v1:two-sum:python3");
  assert.notEqual(draftKey("two-sum", "python3"), draftKey("two-sum", "java"));
  assert.notEqual(draftKey("two-sum", "python3"), draftKey("three-sum", "python3"));
  assert.equal(customInputKey("two-sum"), "antcode:custom-input:v1:two-sum");
});

test("blocked storage falls back to memory", () => {
  const previousWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("full"); } } },
  });
  try {
    const key = draftKey("blocked-storage-test", "javascript");
    writePersisted(key, "saved in memory");
    assert.equal(readPersisted(key, "fallback"), "saved in memory");
  } finally {
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});
