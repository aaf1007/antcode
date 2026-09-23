import { Group, Panel, Separator } from "react-resizable-panels";
import { useEffect, useState } from "react";
import type { ProblemDetailResponse, WorkbenchPayload } from "@/features/problems/problem.types";
import { Icon } from "@/components/ui/Icon";
import { MONACO_LANGUAGE_IDS, useWorkbench } from "../useWorkbench";
import { BottomPanel } from "./BottomPanel";
import { CodeEditor } from "./CodeEditor";
import { StatementPanel } from "./StatementPanel";

type ReadyWorkbench = Extract<WorkbenchPayload, { availability: "ready" }>;

export default function Workbench({ data }: { data: ProblemDetailResponse }) {
  if (data.workbench.availability === "unavailable") {
    return <UnavailableDetail problem={data.problem} reason={data.workbench.reason} />;
  }
  return <ReadyWorkbenchView problem={data.problem} payload={data.workbench} />;
}

function ReadyWorkbenchView({ problem, payload }: { problem: ProblemDetailResponse["problem"]; payload: ReadyWorkbench }) {
  const desktop = useMedia("(min-width: 1024px)");
  const mobile = useMedia("(max-width: 767px)");
  const workbench = useWorkbench(problem.problemId, payload);
  const languageName = payload.languages.find((item) => item.slug === workbench.language)?.name ?? workbench.language;

  const workspace = (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex h-10 shrink-0 items-center gap-2 border-line border-b px-4 text-sm font-semibold">
        <Icon name="code" width="16" height="16" className="text-success" />
        Code
      </div>
      <Toolbar payload={payload} workbench={workbench} />
      {desktop ? (
        <Group orientation="vertical" className="min-h-0 flex-1" id="editor-results">
          <Panel id="editor" defaultSize="68%" minSize={240}>
            <CodeEditor value={workbench.source} onChange={workbench.setSource} language={MONACO_LANGUAGE_IDS[workbench.language]} languageName={languageName} useTextarea={mobile} />
          </Panel>
          <ResizeSeparator orientation="horizontal" />
          <Panel id="results" defaultSize="32%" minSize={210}>
            <BottomPanel payload={payload} activeTab={workbench.activeBottomTab} setActiveTab={workbench.setActiveBottomTab} selection={workbench.selection} setSelection={workbench.setSelection} customInput={workbench.customInput} setCustomInput={workbench.setCustomInput} isRunning={workbench.isRunning} result={workbench.result} />
          </Panel>
        </Group>
      ) : (
        <>
          <div className="h-[32rem] border-line border-b sm:h-[38rem]"><CodeEditor value={workbench.source} onChange={workbench.setSource} language={MONACO_LANGUAGE_IDS[workbench.language]} languageName={languageName} useTextarea={mobile} /></div>
          <BottomPanel payload={payload} activeTab={workbench.activeBottomTab} setActiveTab={workbench.setActiveBottomTab} selection={workbench.selection} setSelection={workbench.setSelection} customInput={workbench.customInput} setCustomInput={workbench.setCustomInput} isRunning={workbench.isRunning} result={workbench.result} />
        </>
      )}
    </div>
  );

  if (!desktop) return <main className="space-y-2 p-2"><div className="overflow-hidden rounded-lg border border-line"><StatementPanel problem={problem} /></div><div className="overflow-hidden rounded-lg border border-line">{workspace}</div></main>;

  return (
    <main className="h-[calc(100dvh-3rem)] overflow-hidden p-2">
      <Group orientation="horizontal" className="h-full" id="statement-workspace">
        <Panel id="statement" defaultSize="42%" minSize={330} className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface"><StatementPanel problem={problem} /></Panel>
        <ResizeSeparator orientation="vertical" />
        <Panel id="workspace" defaultSize="58%" minSize={500} className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface">{workspace}</Panel>
      </Group>
    </main>
  );
}

type WorkbenchState = ReturnType<typeof useWorkbench>;

function Toolbar({ payload, workbench }: { payload: ReadyWorkbench; workbench: WorkbenchState }) {
  return (
    <div className="flex min-h-12 flex-wrap items-center gap-2 border-line border-b bg-surface px-3 py-1">
      <label className="sr-only" htmlFor="workbench-language">Language</label>
      <select id="workbench-language" value={workbench.language} onChange={(event) => workbench.setLanguage(event.target.value as WorkbenchState["language"])} className="min-h-10 rounded-md border border-line bg-canvas px-3 text-sm font-semibold">
        {payload.languages.map((language) => <option key={language.slug} value={language.slug}>{language.name}</option>)}
      </select>
      <span className="rounded-md bg-warning/10 px-2 py-1 text-xs font-semibold text-warning">Simulation mode</span>
      {workbench.isModified && <span className="text-xs text-ink/50">Draft modified</span>}
      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={workbench.reset} className="min-h-10 rounded-md px-3 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink">Reset</button>
        <WorkbenchActions workbench={workbench} />
      </div>
      {(workbench.runDisabledReason || workbench.submitDisabledReason) && <p className="w-full text-xs text-ink/60" role="status">{workbench.runDisabledReason ?? workbench.submitDisabledReason}</p>}
    </div>
  );
}

function WorkbenchActions({ workbench }: { workbench: WorkbenchState }) {
  return (
    <div className="flex items-center gap-2">
      <ActionButton label="Run" onClick={() => void workbench.run()} disabled={workbench.isRunning || Boolean(workbench.runDisabledReason)} reason={workbench.runDisabledReason} />
      <ActionButton label="Submit" primary onClick={() => void workbench.submit()} disabled={workbench.isRunning || Boolean(workbench.submitDisabledReason)} reason={workbench.submitDisabledReason} />
    </div>
  );
}

function ActionButton({ label, onClick, disabled, primary = false, reason }: { label: string; onClick: () => void; disabled: boolean; primary?: boolean; reason: string | null }) {
  return <button type="button" onClick={onClick} disabled={disabled} title={reason ?? undefined} className={`min-h-9 rounded-md px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-45 ${primary ? "bg-success/10 text-success hover:bg-success/20" : "bg-canvas text-ink hover:bg-ink/10"}`}>{label}</button>;
}

function ResizeSeparator({ orientation }: { orientation: "horizontal" | "vertical" }) {
  return (
    <Separator className={`group relative z-10 flex shrink-0 items-center justify-center bg-canvas focus-visible:outline-2 focus-visible:outline-accent-text ${orientation === "vertical" ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"}`}>
      <span aria-hidden="true" className={`absolute rounded-full bg-muted/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${orientation === "vertical" ? "h-10 w-1" : "h-1 w-10"}`} />
    </Separator>
  );
}

function UnavailableDetail({ problem, reason: unavailableReason }: { problem: ProblemDetailResponse["problem"]; reason: Extract<WorkbenchPayload, { availability: "unavailable" }>["reason"] }) {
  const reason = unavailableReason === "premium"
    ? "Premium problems are readable here when their public content is available, but the coding workbench is not available."
    : unavailableReason === "unsupported_category"
      ? "The coding workbench currently supports free Algorithm problems only."
      : "This problem does not yet have all three required starter snippets or public content.";
  return <main className="mx-auto max-w-5xl px-4 py-8"><StatementPanel problem={problem} /><aside className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-4"><h2 className="font-heading font-semibold">Workbench unavailable</h2><p className="mt-1 text-sm text-ink/75">{reason}</p></aside></main>;
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
