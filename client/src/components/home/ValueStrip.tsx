const values = [
  { value: "10", label: "connected core topics" },
  { value: "03", label: "steps in the practice loop" },
  { value: "01", label: "clear path forward" },
];

export function ValueStrip() {
  return (
    <aside aria-label="AntCode at a glance" className="grid overflow-hidden rounded-[18px] border border-line bg-surface shadow-[inset_0_1px_0_var(--color-highlight)] min-[640px]:grid-cols-3">
      {values.map((item, index) => (
        <div key={item.label} className={`flex items-center gap-4 px-5 py-5 min-[640px]:justify-center min-[640px]:px-4 min-[1024px]:gap-5 ${index > 0 ? "border-t border-line min-[640px]:border-t-0 min-[640px]:border-l" : ""}`}>
          <strong className="min-w-8 font-heading text-[26px] leading-none font-bold text-accent-text min-[1024px]:text-[30px]">{item.value}</strong>
          <span className="text-[12px] leading-[1.35] text-muted min-[1024px]:text-[13px]">{item.label}</span>
        </div>
      ))}
    </aside>
  );
}
