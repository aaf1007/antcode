import type { WorkbenchLanguageSlug } from "@/features/problems/problem.types";

export type SandboxRequest = {
  problemId: string;
  languageSlug: WorkbenchLanguageSlug;
  source: string;
  intent: "run" | "submit";
  input:
    | { kind: "sample"; testCaseIndexes: number[] }
    | { kind: "custom"; value: string };
};

export type SandboxOutcome =
  | "passed"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit"
  | "internal_error";

export type SandboxResult = {
  mode: "simulated";
  outcome: SandboxOutcome;
  testResults: Array<{
    index: number;
    outcome: "passed" | "failed" | "error";
    input: string;
    expected?: string;
    output?: string;
    durationMs?: number;
    memoryKb?: number;
  }>;
  compileOutput?: string;
  message?: string;
};

export type ExecuteSandbox = (
  request: SandboxRequest,
  signal: AbortSignal,
) => Promise<SandboxResult>;

type VisibleTestCase = { index: number; input: string; expected: string };

export function createMockExecuteSandbox(
  testCases: VisibleTestCase[],
  fixture?: { outcome?: SandboxOutcome; delayMs?: number },
): ExecuteSandbox {
  return async (request, signal) => {
    await abortableDelay(fixture?.delayMs ?? (request.intent === "submit" ? 850 : 550), signal);

    const outcome = fixture?.outcome ?? fixtureFromSource(request.source);
    if (outcome === "compile_error") {
      return {
        mode: "simulated",
        outcome,
        testResults: [],
        compileOutput: "Simulated compiler fixture: syntax error near line 1.",
      };
    }
    if (outcome === "internal_error") {
      throw new Error("The simulation service could not complete this request.");
    }

    const selected = request.input.kind === "sample"
      ? request.input.testCaseIndexes.flatMap((index) => {
          const testCase = testCases.find((candidate) => candidate.index === index);
          return testCase ? [testCase] : [];
        })
      : [{ index: 0, input: request.input.value, expected: undefined }];

    return {
      mode: "simulated",
      outcome,
      message: request.intent === "submit"
        ? "Simulated submission complete. No progress was recorded."
        : "Simulation complete. Your source code was not executed.",
      testResults: selected.map((testCase, position) => ({
        index: testCase.index,
        outcome: outcome === "passed" ? "passed" : outcome === "wrong_answer" ? "failed" : "error",
        input: testCase.input,
        expected: testCase.expected,
        output: outcome === "passed"
          ? testCase.expected ?? "Simulated custom output"
          : outcome === "wrong_answer"
            ? "Simulated incorrect output"
            : undefined,
        durationMs: outcome === "time_limit" ? 2_000 : 18 + position * 7,
        memoryKb: 14_200 + position * 128,
      })),
    };
  };
}

function fixtureFromSource(source: string): SandboxOutcome {
  if (source.includes("ANTCODE_COMPILE_ERROR")) return "compile_error";
  if (source.includes("ANTCODE_RUNTIME_ERROR")) return "runtime_error";
  if (source.includes("ANTCODE_TIME_LIMIT")) return "time_limit";
  if (source.includes("ANTCODE_WRONG_ANSWER")) return "wrong_answer";
  if (source.includes("ANTCODE_SYSTEM_ERROR")) return "internal_error";
  return "passed";
}

function abortableDelay(delayMs: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = globalThis.setTimeout(resolve, delayMs);
    signal.addEventListener("abort", () => {
      globalThis.clearTimeout(timer);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}
