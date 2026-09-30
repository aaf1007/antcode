import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { CodeTextarea } from "./CodeTextarea";

// React.lazy caches a rejected import, so each retry needs a fresh lazy component. Some browsers
// also cache a failed module fetch, so once a retry fails too, offer a page reload instead.
const loadMonacoCodeEditor = () => lazy(() => import("./MonacoCodeEditor"));

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  languageName: string;
  useTextarea: boolean;
};

export function CodeEditor(props: Props) {
  const [editorKey, setEditorKey] = useState(0);
  const [fallback, setFallback] = useState(false);
  const [MonacoCodeEditor, setMonacoCodeEditor] = useState(loadMonacoCodeEditor);

  if (props.useTextarea || fallback) {
    return (
      <div className="relative h-full">
        {fallback && (
          <div role="alert" className="flex items-center justify-between gap-3 border-line border-b bg-warning/10 px-3 py-2 text-xs">
            <span>The full editor could not load. Using the text editor.</span>
            {editorKey === 0 ? (
              <button type="button" className="font-semibold text-accent-text hover:underline" onClick={() => { setFallback(false); setEditorKey((key) => key + 1); setMonacoCodeEditor(loadMonacoCodeEditor()); }}>
                Retry full editor
              </button>
            ) : (
              <button type="button" className="font-semibold text-accent-text hover:underline" onClick={() => window.location.reload()}>
                Reload page
              </button>
            )}
          </div>
        )}
        <CodeTextarea value={props.value} onChange={props.onChange} languageName={props.languageName} />
      </div>
    );
  }

  return (
    <EditorBoundary key={editorKey} onError={() => setFallback(true)}>
      <Suspense fallback={<p role="status" className="p-4 text-sm text-ink/70">Loading code editor…</p>}>
        <MonacoCodeEditor {...props} />
      </Suspense>
    </EditorBoundary>
  );
}

class EditorBoundary extends Component<{
  children: ReactNode;
  onError: () => void;
}, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
