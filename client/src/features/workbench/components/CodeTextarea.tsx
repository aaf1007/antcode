type Props = {
  value: string;
  onChange: (value: string) => void;
  languageName: string;
};

export function CodeTextarea({ value, onChange, languageName }: Props) {
  return (
    <textarea
      aria-label={`${languageName} source code`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      className="h-full min-h-72 w-full resize-none bg-surface p-4 font-code text-sm leading-6 text-ink outline-none"
    />
  );
}
