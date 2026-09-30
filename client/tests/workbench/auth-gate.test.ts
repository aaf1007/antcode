import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import type { ProblemDetailResponse } from "../../src/features/problems/problem.types.ts";

test("guest Run and Submit, signup, draft preservation, and signed-in Submit", async (t) => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost:3000/problem/two-sum" });
  for (const name of ["window", "document", "navigator", "HTMLElement", "HTMLDialogElement", "Node", "MutationObserver"]) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name as keyof Window] });
  }
  Object.defineProperty(globalThis, "getComputedStyle", { configurable: true, value: dom.window.getComputedStyle.bind(dom.window) });
  Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });
  Object.defineProperty(dom.window, "matchMedia", { configurable: true, value: (query: string) => ({
    matches: query.includes("max-width: 767px"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }) });
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };

  const React = await import("react");
  Object.defineProperty(globalThis, "React", { configurable: true, value: React });
  const { act, cleanup, fireEvent, render, screen, waitFor } = await import("@testing-library/react");
  t.after(() => { cleanup(); dom.window.close(); });

  let signedIn = false;
  let serverSession = false;
  let sessionChecks = 0;
  let notifySession: (() => void) | undefined;
  const session = { session: { id: "test-session" }, user: { name: "testuser", username: "testuser", email: "test@example.test" } };
  const setSignedIn = (value: boolean) => {
    signedIn = value;
    notifySession?.();
  };
  const authClient = {
    useSession: () => {
      const [currentSignedIn, setCurrentSignedIn] = React.useState(signedIn);
      notifySession = () => setCurrentSignedIn(signedIn);
      return { data: currentSignedIn ? session : null, isPending: false, error: null, refetch: async () => { setSignedIn(serverSession); } };
    },
    signUp: { email: async () => { serverSession = true; setSignedIn(true); return { data: session, error: null }; } },
    signIn: { email: async () => ({ data: session, error: null }), username: async () => ({ data: session, error: null }) },
    getSession: async () => { sessionChecks += 1; return { data: serverSession ? session : null, error: null }; },
  };
  t.mock.module(new URL("../../src/features/users/auth-client.ts", import.meta.url).href, { namedExports: { authClient } });
  const { default: Workbench } = await import("../../src/features/workbench/components/Workbench.tsx");

  const data: ProblemDetailResponse = {
    problem: {
      problemId: "p_auth_test", slug: "two-sum", frontendId: 1, title: "Two Sum",
      url: "https://example.test/two-sum", difficulty: "Easy", category: "Algorithms",
      isPremium: false, acRate: 50, contentText: "Find two numbers.",
      exampleInputFirst: "1 2", likes: 1, dislikes: 0, totalAccepted: 1, totalSubmitted: 2,
    },
    workbench: {
      availability: "ready",
      languages: [{ slug: "python3", name: "Python 3", starterCode: "pass" }],
      testCases: [{ index: 0, input: "1 2", expected: "3" }],
    },
  };
  render(React.createElement(Workbench, { data }));

  fireEvent.click(screen.getByRole("button", { name: "Run" }));
  await screen.findByText("Simulation complete. Your source code was not executed.");
  fireEvent.change(screen.getByRole("textbox", { name: "Python 3 source code" }), { target: { value: "# keep this draft\npass" } });
  fireEvent.click(screen.getByRole("tab", { name: "testcase" }));
  fireEvent.click(screen.getByRole("tab", { name: "Custom" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Custom input" }), { target: { value: "sample draft input" } });

  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  assert.ok(screen.getByRole("dialog", { name: "Create an account to submit" }));
  assert.equal((screen.getByRole("textbox", { name: "Python 3 source code" }) as HTMLTextAreaElement).value, "# keep this draft\npass");
  fireEvent.change(screen.getByRole("textbox", { name: "Username" }), { target: { value: "testuser" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Email" }), { target: { value: "test@example.test" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password1234" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Create account" })); });

  await waitFor(() => assert.equal(screen.queryByRole("dialog"), null));
  assert.equal((screen.getByRole("textbox", { name: "Python 3 source code" }) as HTMLTextAreaElement).value, "# keep this draft\npass");
  assert.equal((screen.getByRole("textbox", { name: "Custom input" }) as HTMLTextAreaElement).value, "sample draft input");
  assert.equal(screen.queryByText("Simulated submission complete. No progress was recorded."), null);

  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await screen.findByText("Simulated submission complete. No progress was recorded.");
  assert.equal(sessionChecks, 1);

  await act(async () => { serverSession = false; setSignedIn(true); });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await screen.findByRole("dialog", { name: "Create an account to submit" });
});
