import type { WorkbenchPayload } from "@/features/problems/problem.types";
import type { SandboxResult } from "../sandbox";
import type { TestSelection } from "../useWorkbench";

type ReadyWorkbench = Extract<WorkbenchPayload, { availability: "ready" }>;

type Props = {
  payload: ReadyWorkbench;
  activeTab: "testcase" | "result";
  setActiveTab: (tab: "testcase" | "result") => void;
  selection: TestSelection;
  setSelection: (selection: TestSelection) => void;
  customInput: string;
  setCustomInput: (value: string) => void;
  isRunning: boolean;
  result: SandboxResult | null;
};

export function BottomPanel(props: Props) {
  return (
    <section aria-label="Test cases and simulation result" className="flex h-full min-h-64 flex-col bg-surface">
      <div role="tablist" aria-label="Workbench output" className="flex border-line border-b px-3">
        {(["testcase", "result"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={props.activeTab === tab}
            onClick={() => props.setActiveTab(tab)}
            className={`border-b-2 px-3 py-3 text-sm font-semibold capitalize ${props.activeTab === tab ? "border-accent-text text-ink" : "border-transparent text-ink/60 hover:text-ink"}`}
          >
            {tab}
            {tab === "result" && props.isRunning && <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto p-4">
        {props.activeTab === "testcase" ? <TestcasePanel {...props} /> : <ResultPanel isRunning={props.isRunning} result={props.result} />}
      </div>
    </section>
  );
}

function TestcasePanel(props: Props) {
  const selectedIndex = props.selection.kind === "sample" ? props.selection.index : null;
  const activeCase = props.selection.kind === "sample"
    ? props.payload.testCases.find((testCase) => testCase.index === selectedIndex)
    : undefined;
  return (
    <>
      <div role="tablist" aria-label="Visible test cases" className="flex flex-wrap gap-2">
        {props.payload.testCases.map((testCase, position) => (
          <button key={testCase.index} role="tab" type="button" aria-selected={selectedIndex === testCase.index} onClick={() => props.setSelection({ kind: "sample", index: testCase.index })} className={caseTabClass(selectedIndex === testCase.index)}>
            Case {position + 1}
          </button>
        ))}
        <button role="tab" type="button" aria-selected={props.selection.kind === "custom"} onClick={() => props.setSelection({ kind: "custom" })} className={caseTabClass(props.selection.kind === "custom")}>
          Custom
        </button>
      </div>

      {props.selection.kind === "custom" ? (
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-ink/60">
          Custom input
          <textarea value={props.customInput} onChange={(event) => props.setCustomInput(event.target.value)} placeholder="Enter input for the simulation…" spellCheck={false} className="mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-canvas p-3 font-code text-sm font-normal normal-case tracking-normal text-ink" />
        </label>
      ) : activeCase ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <CodeBlock label="Input" value={activeCase.input} />
          <CodeBlock label="Expected output" value={activeCase.expected} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink/70">No visible sample cases are available. Use Custom input to try the simulation.</p>
      )}
    </>
  );
}

function ResultPanel({ isRunning, result }: { isRunning: boolean; result: SandboxResult | null }) {
  if (isRunning) return <div role="status"><p className="font-semibold">Running simulation…</p><p className="mt-2 text-sm text-ink/60">No code is being executed. A deterministic fixture result will appear shortly.</p></div>;
  if (!result) return <p className="text-sm text-ink/60">Run or submit to view a simulated result.</p>;

  return (
    <div aria-live="polite">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-text">Simulation</span>
        <h3 className={`font-heading text-lg font-semibold ${outcomeClass(result.outcome)}`}>{formatOutcome(result.outcome)}</h3>
      </div>
      <p className="mt-2 text-sm text-ink/70">{result.message ?? "The simulation returned a fixture result."}</p>
      {result.compileOutput && <CodeBlock label="Compiler output" value={result.compileOutput} />}
      <div className="mt-4 space-y-3">
        {result.testResults.map((testCase, position) => (
          <details key={`${testCase.index}-${position}`} open className="rounded-lg border border-line p-3">
            <summary className="cursor-pointer font-semibold">Case {position + 1}: <span className={testCase.outcome === "passed" ? "text-success" : "text-danger"}>{testCase.outcome}</span></summary>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <CodeBlock label="Input" value={testCase.input} />
              {testCase.expected !== undefined && <CodeBlock label="Expected" value={testCase.expected} />}
              {testCase.output !== undefined && <CodeBlock label="Simulated output" value={testCase.output} />}
            </div>
            {(testCase.durationMs !== undefined || testCase.memoryKb !== undefined) && <p className="mt-3 text-xs text-ink/60">{testCase.durationMs !== undefined && `${testCase.durationMs} ms`}{testCase.durationMs !== undefined && testCase.memoryKb !== undefined && " · "}{testCase.memoryKb !== undefined && `${testCase.memoryKb.toLocaleString()} KB`}</p>}
          </details>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">No code was actually executed and no progress was recorded.</p>
    </div>
  );
}

function CodeBlock({ label, value }: { label: string; value: string }) {
  return <div className="mt-3"><p className="text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</p><pre className="mt-2 overflow-x-auto rounded-md bg-canvas p-3 font-code text-xs whitespace-pre-wrap text-ink">{value || "(empty)"}</pre></div>;
}

function caseTabClass(active: boolean) {
  return `rounded-md px-3 py-1.5 text-sm font-semibold ${active ? "bg-accent/20 text-ink" : "bg-highlight text-ink/60 hover:text-ink"}`;
}

function formatOutcome(outcome: SandboxResult["outcome"]) {
  return outcome.split("_").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

function outcomeClass(outcome: SandboxResult["outcome"]) {
  return outcome === "passed" ? "text-success" : outcome === "internal_error" ? "text-warning" : "text-danger";
}
