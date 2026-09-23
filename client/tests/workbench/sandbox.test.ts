import assert from "node:assert/strict";
import { test } from "node:test";
import { createMockExecuteSandbox } from "../../src/features/workbench/sandbox.ts";

const testCases = [{ index: 3, input: "[1]", expected: "1" }];
const request = {
  problemId: "demo",
  languageSlug: "python3" as const,
  source: "pass",
  intent: "run" as const,
  input: { kind: "sample" as const, testCaseIndexes: [3] },
};

test("mock sandbox returns deterministic simulated fixture results", async () => {
  const execute = createMockExecuteSandbox(testCases, { delayMs: 0 });
  const result = await execute(request, new AbortController().signal);
  assert.equal(result.mode, "simulated");
  assert.equal(result.outcome, "passed");
  assert.deepEqual(result.testResults[0], {
    index: 3,
    outcome: "passed",
    input: "[1]",
    expected: "1",
    output: "1",
    durationMs: 18,
    memoryKb: 14_200,
  });
});

test("mock sandbox supports error fixtures", async () => {
  const execute = createMockExecuteSandbox(testCases, { outcome: "compile_error", delayMs: 0 });
  const result = await execute(request, new AbortController().signal);
  assert.equal(result.outcome, "compile_error");
  assert.match(result.compileOutput ?? "", /Simulated compiler/);
});

test("mock sandbox respects cancellation", async () => {
  const execute = createMockExecuteSandbox(testCases, { delayMs: 100 });
  const controller = new AbortController();
  const pending = execute(request, controller.signal);
  controller.abort();
  await assert.rejects(pending, /abort/i);
});
