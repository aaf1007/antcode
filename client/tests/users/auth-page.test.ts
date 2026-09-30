import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("auth page redirects signed-in users and passes returnTo through", async (t) => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost:3000/sign-in" });
  for (const name of ["window", "document", "navigator", "HTMLElement", "Node"]) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name as keyof Window] });
  }
  Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });

  const React = await import("react");
  Object.defineProperty(globalThis, "React", { configurable: true, value: React });
  const { act, cleanup, fireEvent, render, screen, waitFor } = await import("@testing-library/react");
  t.after(() => { cleanup(); dom.window.close(); });

  let signedIn = false;
  const session = { session: { id: "test-session" }, user: { name: "testuser", username: "testuser", email: "test@example.test" } };
  const signInCalls: unknown[] = [];
  const authClient = {
    useSession: () => {
      return { data: signedIn ? session : null, isPending: false, error: null };
    },
    signIn: {
      email: async () => ({ data: session, error: null }),
      username: async (body: unknown) => { signInCalls.push(body); return { data: session, error: null }; },
    },
  };
  t.mock.module(new URL("../../src/features/users/auth-client.ts", import.meta.url).href, { namedExports: { authClient } });
  const { MemoryRouter, Route, Routes, useLocation } = await import("react-router");
  const { AuthPage } = await import("../../src/features/users/AuthPage.tsx");
  const Where = () => { const { pathname, search, hash } = useLocation(); return React.createElement("p", { "data-testid": "where" }, `${pathname}${search}${hash}`); };
  const app = (entry: string) => React.createElement(MemoryRouter, { initialEntries: [entry] },
    React.createElement(Routes, null,
      React.createElement(Route, { path: "/sign-in", element: React.createElement(AuthPage, { mode: "sign-in" }) }),
      React.createElement(Route, { path: "*", element: React.createElement(Where) })));

  // Guests see the form; the "create an account" link keeps the destination.
  const returnTo = "/problem/two-sum?tab=code#editor";
  const view = render(app(`/sign-in?returnTo=${encodeURIComponent(returnTo)}`));
  assert.equal(screen.getByRole("link", { name: "Create an account" }).getAttribute("href"), `/sign-up?returnTo=${encodeURIComponent(returnTo)}`);

  // Successful sign-in navigates to the returnTo destination.
  fireEvent.change(screen.getByRole("textbox", { name: "Email or username" }), { target: { value: " testuser " } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password1234" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Sign in" })); });
  assert.deepEqual(signInCalls, [{ username: "testuser", password: "password1234" }]);
  assert.equal(screen.getByTestId("where").textContent, returnTo);
  view.unmount();

  // An already signed-in visitor is redirected immediately, and unsafe destinations fall back to /problem.
  signedIn = true;
  render(app(`/sign-in?returnTo=${encodeURIComponent("/.//evil.example")}`));
  await waitFor(() => assert.equal(screen.getByTestId("where").textContent, "/problem"));
  assert.equal(screen.queryByRole("button", { name: "Sign in" }), null);
});
