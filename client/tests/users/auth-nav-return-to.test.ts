import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("sign-in links return to the full current location", async (t) => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost:3000/problem" });
  for (const name of ["window", "document", "navigator", "HTMLElement", "Node"]) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name as keyof Window] });
  }
  Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });

  const React = await import("react");
  Object.defineProperty(globalThis, "React", { configurable: true, value: React });
  const { cleanup, render, screen } = await import("@testing-library/react");
  t.after(() => { cleanup(); dom.window.close(); });

  const authClient = { useSession: () => ({ data: null, isPending: false }), signOut: async () => ({ error: null }) };
  t.mock.module(new URL("../../src/features/users/auth-client.ts", import.meta.url).href, { namedExports: { authClient } });
  const { MemoryRouter } = await import("react-router");
  const { AuthNavControls } = await import("../../src/features/users/AuthNavControls.tsx");
  render(React.createElement(MemoryRouter, { initialEntries: ["/problem/two-sum?lang=python3#editor"] }, React.createElement(AuthNavControls)));

  const suffix = `?returnTo=${encodeURIComponent("/problem/two-sum?lang=python3#editor")}`;
  assert.equal(screen.getByRole("link", { name: "Sign in" }).getAttribute("href"), `/sign-in${suffix}`);
  assert.equal(screen.getByRole("link", { name: "Sign up" }).getAttribute("href"), `/sign-up${suffix}`);
});
