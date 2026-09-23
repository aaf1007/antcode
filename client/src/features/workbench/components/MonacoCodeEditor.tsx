import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor/editor/editor.api.js";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import "monaco-editor/languages/definitions/python/register.js";
import "monaco-editor/languages/definitions/javascript/register.js";
import "monaco-editor/languages/definitions/java/register.js";
import { useEffect, useState } from "react";

self.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
};
loader.config({ monaco });

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  languageName: string;
};

export default function MonacoCodeEditor({ value, onChange, language, languageName }: Props) {
  const theme = useDocumentTheme();
  return (
    <Editor
      aria-label={`${languageName} source code`}
      height="100%"
      language={language}
      value={value}
      theme={theme === "dark" ? "vs-dark" : "light"}
      onChange={(next) => onChange(next ?? "")}
      options={{
        automaticLayout: true,
        fontFamily: "var(--mono)",
        fontSize: 14,
        lineHeight: 22,
        minimap: { enabled: false },
        padding: { top: 14 },
        scrollBeyondLastLine: false,
        tabSize: 4,
        wordWrap: "on",
      }}
      loading={<p role="status" className="p-4 text-sm text-ink/70">Loading code editor…</p>}
    />
  );
}

function useDocumentTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "light");
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme ?? "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}
