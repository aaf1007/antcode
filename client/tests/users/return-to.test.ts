import assert from "node:assert/strict";
import { test } from "node:test";
import { safeReturnTo } from "../../src/features/users/return-to.ts";

test("auth return destination stays within the app", () => {
  assert.equal(safeReturnTo("/problem/two-sum?tab=code"), "/problem/two-sum?tab=code");
  for (const value of [null, "https://evil.example", "//evil.example", "/\\evil.example", "/\n/evil.example", "/\t/evil.example", "/\t\\evil.example", "/a/../sign-in", "/sign-in", "/sign-in/", "/SIGN-UP", "/%73ign-in", "/sign-up?returnTo=%2Fsign-in", "/.//evil.com", "/a/..//evil.com", "/%2e//evil.com", "/%2e%2e//evil.com", "/./\\evil.com", "/a\\b"]) {
    assert.equal(safeReturnTo(value), "/problem");
  }
});
