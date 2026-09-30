import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import type { ProblemDetailResponse } from "../../src/features/problems/problem.types.ts";

const problem: ProblemDetailResponse["problem"] = {
  problemId: "p_workbench_test", slug: "two-sum", frontendId: 1, title: "Two Sum",
  url: "https://example.test/two-sum", difficulty: "Easy", category: "Algorithms",
  isPremium: false, acRate: 50, contentText: "Find two numbers.",
  exampleInputFirst: "1 2", likes: 1, dislikes: 0, totalAccepted: 1, totalSubmitted: 2,
};

let mobile = true;

const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost:3000/problem/two-sum" });
for (const name of ["window", "document", "navigator", "HTMLElement", "HTMLDialogElement", "Node", "MutationObserver"]) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name as keyof Window] });
}
Object.defineProperty(globalThis, "getComputedStyle", { configurable: true, value: dom.window.getComputedStyle.bind(dom.window) });
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });
Object.defineProperty(dom.window, "matchMedia", { configurable: true, value: (query: string) => ({
  matches: mobile && query.includes("max-width: 767px"),
  media: query,
  addEventListener() {},
  removeEventListener() {},
}) });

const React = await import("react");
Object.defineProperty(globalThis, "React", { configurable: true, value: React });
const { cleanup, fireEvent, render, screen, waitFor } = await import("@testing-library/react");

// Tests set these; the mocked auth client reads them at call time, so whichever test first
// loads Workbench (and binds the mock) still sees later tests' session state.
type SessionResult = { data: { session: object } | null; error: null };
let sessionData: SessionResult["data"] = null;
let getSession: () => Promise<SessionResult> = async () => ({ data: null, error: null });
const authClient = {
  useSession: () => ({ data: sessionData, isPending: false, error: null, refetch: async () => {} }),
  getSession: () => getSession(),
};

test.afterEach(() => {
  cleanup();
  dom.window.localStorage.clear();
  mobile = true;
  sessionData = null;
  getSession = async () => ({ data: null, error: null });
});
test.after(() => dom.window.close());

async function loadWorkbench(t: import("node:test").TestContext) {
  t.mock.module(new URL("../../src/features/users/auth-client.ts", import.meta.url).href, { namedExports: { authClient } });
  return (await import("../../src/features/workbench/components/Workbench.tsx")).default;
}

test("a ready payload without python3 defaults to the first available language", async (t) => {
  const Workbench = await loadWorkbench(t);
  render(React.createElement(Workbench, { data: {
    problem,
    workbench: {
      availability: "ready",
      languages: [{ slug: "javascript", name: "JavaScript", starterCode: "function solve() {}" }],
      testCases: [{ index: 0, input: "1 2", expected: "3" }],
    },
  } }));

  assert.equal((screen.getByRole("combobox", { name: "Language" }) as HTMLSelectElement).value, "javascript");
  assert.equal((screen.getByRole("textbox", { name: "JavaScript source code" }) as HTMLTextAreaElement).value, "function solve() {}");
  fireEvent.click(screen.getByRole("button", { name: "Run" }));
  await screen.findByText("Simulation complete. Your source code was not executed.");
});

test("switching language flushes the pending draft save", async (t) => {
  const Workbench = await loadWorkbench(t);
  render(React.createElement(Workbench, { data: {
    problem,
    workbench: {
      availability: "ready",
      languages: [
        { slug: "python3", name: "Python 3", starterCode: "pass" },
        { slug: "javascript", name: "JavaScript", starterCode: "// js" },
      ],
      testCases: [{ index: 0, input: "1 2", expected: "3" }],
    },
  } }));

  fireEvent.change(screen.getByRole("textbox", { name: "Python 3 source code" }), { target: { value: "# last edit" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Language" }), { target: { value: "javascript" } });
  assert.equal(dom.window.localStorage.getItem(`antcode:draft:v1:${problem.problemId}:python3`), "# last edit");
});

test("the full editor can be retried after its chunk fails to load", async (t) => {
  mobile = false;
  const Workbench = await loadWorkbench(t);
  const data: ProblemDetailResponse = {
    problem: { ...problem, problemId: "p_monaco_retry_test" },
    workbench: {
      availability: "ready",
      languages: [{ slug: "python3", name: "Python 3", starterCode: "pass" }],
      testCases: [{ index: 0, input: "1 2", expected: "3" }],
    },
  };
  const originalConsoleError = console.error;
  console.error = () => {};
  t.after(() => { console.error = originalConsoleError; });

  // Monaco's Vite-only worker import cannot load under Node, so the first attempt fails like a missing chunk.
  render(React.createElement(Workbench, { data }));
  await screen.findByText("The full editor could not load. Using the text editor.", undefined, { timeout: 10_000 });
  assert.equal((screen.getByRole("textbox", { name: "Python 3 source code" }) as HTMLTextAreaElement).value, "pass");

  t.mock.module(new URL("../../src/features/workbench/components/MonacoCodeEditor.tsx", import.meta.url).href, {
    defaultExport: ({ languageName }: { languageName: string }) =>
      React.createElement("div", { "data-testid": "monaco" }, `${languageName} full editor`),
  });
  fireEvent.click(screen.getByRole("button", { name: "Retry full editor" }));
  await waitFor(() => assert.equal(screen.getByTestId("monaco").textContent, "Python 3 full editor"));
  assert.equal(screen.queryByRole("alert"), null);
});

test("submit sends the source as edited while the session check was pending", async (t) => {
  sessionData = { session: {} };
  let finishSessionCheck: (result: SessionResult) => void = () => {};
  getSession = () => new Promise((resolve) => { finishSessionCheck = resolve; });
  const Workbench = await loadWorkbench(t);
  render(React.createElement(Workbench, { data: {
    problem: { ...problem, problemId: "p_stale_submit_test" },
    workbench: {
      availability: "ready",
      languages: [{ slug: "python3", name: "Python 3", starterCode: "pass" }],
      testCases: [{ index: 0, input: "1 2", expected: "3" }],
    },
  } }));

  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await screen.findByText("Checking your account…");
  // The simulated sandbox reports a compile error for this marker, so the result shows which source was sent.
  fireEvent.change(screen.getByRole("textbox", { name: "Python 3 source code" }), { target: { value: "ANTCODE_COMPILE_ERROR" } });
  finishSessionCheck({ data: { session: {} }, error: null });

  await screen.findByText("Simulated compiler fixture: syntax error near line 1.", undefined, { timeout: 5_000 });
});

test("the full editor offers a page reload once a retry also fails", async (t) => {
  mobile = false;
  const Workbench = await loadWorkbench(t);
  const originalConsoleError = console.error;
  console.error = () => {};
  t.after(() => { console.error = originalConsoleError; });

  render(React.createElement(Workbench, { data: {
    problem: { ...problem, problemId: "p_monaco_reload_test" },
    workbench: {
      availability: "ready",
      languages: [{ slug: "python3", name: "Python 3", starterCode: "pass" }],
      testCases: [{ index: 0, input: "1 2", expected: "3" }],
    },
  } }));
  fireEvent.click(await screen.findByRole("button", { name: "Retry full editor" }, { timeout: 10_000 }));
  await screen.findByRole("button", { name: "Reload page" }, { timeout: 10_000 });
  assert.equal(screen.queryByRole("button", { name: "Retry full editor" }), null);
});
