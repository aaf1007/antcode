import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("failed sign-out keeps the menu open and lets the user retry", async (t) => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost:3000/problem" });
  for (const name of ["window", "document", "navigator", "HTMLElement", "Node"]) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name as keyof Window] });
  }
  Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });

  const React = await import("react");
  Object.defineProperty(globalThis, "React", { configurable: true, value: React });
  const { act, cleanup, fireEvent, render, screen } = await import("@testing-library/react");
  t.after(() => { cleanup(); dom.window.close(); });

  let attempts = 0;
  let menuCloses = 0;
  const authClient = {
    useSession: () => ({ data: { user: { username: "testuser", name: "testuser" } }, isPending: false }),
    signOut: async () => {
      attempts += 1;
      return attempts === 1 ? { error: { message: "Unavailable" } } : { error: null };
    },
  };
  t.mock.module(new URL("../../src/features/users/auth-client.ts", import.meta.url).href, { namedExports: { authClient } });
  const { MemoryRouter } = await import("react-router");
  const { AuthNavControls } = await import("../../src/features/users/AuthNavControls.tsx");
  render(React.createElement(MemoryRouter, null,
    React.createElement(AuthNavControls, { onNavigate: () => { menuCloses += 1; } })));

  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Sign out" })); });
  assert.equal(menuCloses, 0);
  assert.equal(screen.getByRole("alert").textContent, "Could not sign out. Please try again.");
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Sign out" })); });
  assert.equal(attempts, 2);
  assert.equal(menuCloses, 1);
  assert.equal(screen.queryByRole("alert"), null);
});
