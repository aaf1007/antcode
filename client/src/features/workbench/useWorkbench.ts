import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  WorkbenchLanguageSlug,
  WorkbenchPayload,
} from "@/features/problems/problem.types";
import {
  createMockExecuteSandbox,
  type ExecuteSandbox,
  type SandboxRequest,
  type SandboxResult,
} from "./sandbox";
import { customInputKey, draftKey, readPersisted, writePersisted } from "./storage";

type ReadyWorkbench = Extract<WorkbenchPayload, { availability: "ready" }>;
export type TestSelection = { kind: "sample"; index: number } | { kind: "custom" };

export const MONACO_LANGUAGE_IDS: Record<WorkbenchLanguageSlug, string> = {
  python3: "python",
  javascript: "javascript",
  java: "java",
};

export function useWorkbench(
  problemId: string,
  payload: ReadyWorkbench,
  executeOverride?: ExecuteSandbox,
) {
  const [language, setLanguageState] = useState<WorkbenchLanguageSlug>("python3");
  const [sources, setSources] = useState<Record<WorkbenchLanguageSlug, string>>(() =>
    Object.fromEntries(payload.languages.map((item) => [
      item.slug,
      readPersisted(draftKey(problemId, item.slug), item.starterCode),
    ])) as Record<WorkbenchLanguageSlug, string>,
  );
  const [customInput, setCustomInputState] = useState(() =>
    readPersisted(customInputKey(problemId), ""),
  );
  const [selection, setSelectionState] = useState<TestSelection>(() =>
    payload.testCases[0]
      ? { kind: "sample", index: payload.testCases[0].index }
      : { kind: "custom" },
  );
  const [activeBottomTab, setActiveBottomTab] = useState<"testcase" | "result">("testcase");
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const attemptRef = useRef(0);
  const execute = useMemo(
    () => executeOverride ?? createMockExecuteSandbox(payload.testCases),
    [executeOverride, payload.testCases],
  );

  const source = sources[language];
  const starterCode = payload.languages.find((item) => item.slug === language)?.starterCode ?? "";

  const invalidateResult = useCallback(() => {
    attemptRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setIsRunning(false);
    setResult(null);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      writePersisted(draftKey(problemId, language), source);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [language, problemId, source]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      writePersisted(customInputKey(problemId), customInput);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [customInput, problemId]);

  const setSource = useCallback((value: string) => {
    invalidateResult();
    setSources((current) => ({ ...current, [language]: value }));
  }, [invalidateResult, language]);

  const setLanguage = useCallback((value: WorkbenchLanguageSlug) => {
    invalidateResult();
    setLanguageState(value);
  }, [invalidateResult]);

  const setCustomInput = useCallback((value: string) => {
    invalidateResult();
    setCustomInputState(value);
  }, [invalidateResult]);

  const setSelection = useCallback((value: TestSelection) => {
    invalidateResult();
    setSelectionState(value);
    setActiveBottomTab("testcase");
  }, [invalidateResult]);

  const reset = useCallback(() => {
    if (
      source !== starterCode &&
      !window.confirm(`Reset your ${payload.languages.find((item) => item.slug === language)?.name ?? "current"} draft?`)
    ) return false;
    invalidateResult();
    setSources((current) => ({ ...current, [language]: starterCode }));
    writePersisted(draftKey(problemId, language), starterCode);
    return true;
  }, [invalidateResult, language, payload.languages, problemId, source, starterCode]);

  const run = useCallback(async (intent: SandboxRequest["intent"]) => {
    if (!source.trim()) return;
    if (intent === "run" && payload.testCases.length === 0) return;

    invalidateResult();
    const controller = new AbortController();
    abortRef.current = controller;
    const attempt = attemptRef.current;
    setIsRunning(true);
    setActiveBottomTab("result");

    const input: SandboxRequest["input"] = intent === "submit"
      ? { kind: "sample", testCaseIndexes: payload.testCases.map((testCase) => testCase.index) }
      : selection.kind === "custom"
        ? { kind: "custom", value: customInput }
        : { kind: "sample", testCaseIndexes: [selection.index] };

    try {
      const nextResult = await execute({ problemId, languageSlug: language, source, intent, input }, controller.signal);
      if (attempt === attemptRef.current && !controller.signal.aborted) setResult(nextResult);
    } catch (error) {
      if (controller.signal.aborted || attempt !== attemptRef.current) return;
      setResult({
        mode: "simulated",
        outcome: "internal_error",
        testResults: [],
        message: error instanceof Error ? error.message : "The simulation failed.",
      });
    } finally {
      if (attempt === attemptRef.current) setIsRunning(false);
    }
  }, [customInput, execute, invalidateResult, language, payload.testCases, problemId, selection, source]);

  return {
    language,
    source,
    customInput,
    selection,
    activeBottomTab,
    result,
    isRunning,
    isModified: source !== starterCode,
    runDisabledReason: !source.trim()
      ? "Enter source code to run the simulation."
      : payload.testCases.length === 0
        ? "Run is unavailable because this problem has no visible sample cases."
        : null,
    submitDisabledReason: !source.trim() ? "Enter source code to submit the simulation." : null,
    setLanguage,
    setSource,
    setCustomInput,
    setSelection,
    setActiveBottomTab,
    reset,
    run: () => run("run"),
    submit: () => run("submit"),
  };
}
