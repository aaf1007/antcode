import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";

test("auth dialog keeps typed values across mode switches and closes via button or Escape", async (t) => {
  const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost:3000/problem/two-sum" });
  for (const name of ["window", "document", "navigator", "HTMLElement", "HTMLDialogElement", "Node", "Event"]) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name as keyof Window] });
  }
  Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, writable: true, value: true });
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };

  const React = await import("react");
  Object.defineProperty(globalThis, "React", { configurable: true, value: React });
  const { act, cleanup, fireEvent, render, screen } = await import("@testing-library/react");
  t.after(() => { cleanup(); dom.window.close(); });

  const authClient = {
    signUp: { email: async () => ({ data: null, error: { status: 422, message: "Username is taken." } }) },
    signIn: { email: async () => ({ data: null, error: null }), username: async () => ({ data: null, error: null }) },
  };
  t.mock.module(new URL("../../src/features/users/auth-client.ts", import.meta.url).href, { namedExports: { authClient } });
  const { AuthDialog } = await import("../../src/features/users/AuthDialog.tsx");

  let closes = 0;
  let successes = 0;
  render(React.createElement(AuthDialog, { onClose: () => { closes += 1; }, onSuccess: () => { successes += 1; } }));
  const dialog = screen.getByRole("dialog", { name: "Create an account to submit" });
  assert.ok(dialog.hasAttribute("open"));

  fireEvent.change(screen.getByRole("textbox", { name: "Username" }), { target: { value: "testuser" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Email" }), { target: { value: "test@example.test" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password1234" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Create account" })); });

  // Errors are announced and linked to the inputs.
  const alert = screen.getByRole("alert");
  assert.equal(alert.textContent, "Username is taken.");
  const username = screen.getByRole("textbox", { name: "Username" });
  assert.equal(username.getAttribute("aria-invalid"), "true");
  assert.ok(username.getAttribute("aria-describedby")?.split(" ").includes(alert.id));
  assert.equal(username.getAttribute("aria-describedby")?.split(" ").length, 2);

  // Switching to sign-in keeps the password and carries the email over; the stale error is cleared.
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  assert.ok(screen.getByRole("dialog", { name: "Sign in to submit" }));
  assert.equal((screen.getByRole("textbox", { name: "Email or username" }) as HTMLInputElement).value, "test@example.test");
  assert.equal((screen.getByLabelText("Password") as HTMLInputElement).value, "password1234");
  assert.equal(screen.queryByRole("alert"), null);
  assert.equal(screen.getByLabelText("Password").getAttribute("aria-invalid"), null);

  // Switching back restores the sign-up values.
  fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
  assert.equal((screen.getByRole("textbox", { name: "Username" }) as HTMLInputElement).value, "testuser");
  assert.equal((screen.getByRole("textbox", { name: "Email" }) as HTMLInputElement).value, "test@example.test");

  fireEvent.click(screen.getByRole("button", { name: "Close account dialog" }));
  assert.equal(closes, 1);
  const cancel = new dom.window.Event("cancel", { cancelable: true });
  fireEvent(dialog, cancel);
  assert.equal(closes, 2);
  assert.equal(cancel.defaultPrevented, true);
  assert.equal(successes, 0);
});
