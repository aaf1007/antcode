declare module "monaco-editor/editor/editor.api.js" {
  export * from "monaco-editor";
}

declare module "monaco-editor/languages/definitions/python/register.js";
declare module "monaco-editor/languages/definitions/javascript/register.js";
declare module "monaco-editor/languages/definitions/java/register.js";

// Vite's `*?worker` wildcard does not match this package subpath, so declare the worker import directly.
declare module "monaco-editor/editor/editor.worker?worker" {
  const EditorWorker: { new (options?: { name?: string }): Worker };
  export default EditorWorker;
}
