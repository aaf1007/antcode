const topics = [
  { name: "Arrays", position: "col-start-3 row-start-1", label: "The starting point" },
  { name: "Two Pointers", position: "col-start-2 row-start-2", label: "Technique" },
  { name: "Stack", position: "col-start-4 row-start-2", label: "Data structure" },
  { name: "Linked List", position: "col-start-1 row-start-3", label: "Data structure" },
  { name: "Binary Search", position: "col-start-3 row-start-3", label: "Technique" },
  { name: "Sliding Window", position: "col-start-5 row-start-3", label: "Technique" },
  { name: "Trees", position: "col-start-3 row-start-4", label: "Data structure" },
  { name: "Tries", position: "col-start-1 row-start-5", label: "Data structure" },
  { name: "Heap", position: "col-start-3 row-start-5", label: "Data structure" },
  { name: "Backtracking", position: "col-start-5 row-start-5", label: "Technique" },
];

export function LearningRoadmap() {
  return (
    <figure id="roadmap" aria-labelledby="roadmap-caption" className="w-full min-w-0 max-w-[560px] scroll-mt-[120px] justify-self-center min-[1024px]:max-w-[clamp(300px,calc((100svh_-_240px)*0.8),560px)]">
      <div className="relative aspect-[540/478]">
        <svg className="absolute inset-0 size-full stroke-connector stroke-[1.5]" viewBox="0 0 540 478" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M270 70v6q0 10-10 10h-72q-10 0-10 10v6m92-26q0 10 10 10h72q10 0 10 10v6" />
          <path d="M178 172v6q0 10-10 10H96q-10 0-10 10v6m92-26q0 10 10 10h72q10 0 10 10v6m92-32v6q0 10 10 10h72q10 0 10 10v6" />
          <path d="M86 274v6q0 10 10 10h164q10 0 10 10v6m0-32v32m184-32v6q0 10-10 10H280q-10 0-10 10" />
          <path d="M270 376v6q0 10-10 10H96q-10 0-10 10v6m184-26v26m0-26q0 10 10 10h164q10 0 10 10v6" />
        </svg>
        <ol className="absolute inset-0 grid grid-cols-6 grid-rows-[repeat(5,1fr)] gap-x-[2.2222%] gap-y-[6.6946%]" aria-label="Algorithm topics, from foundations to advanced patterns">
          {topics.map((topic) => (
            <li key={topic.name} className={`col-span-2 flex flex-col items-center justify-center gap-[7px] rounded-[10px] border border-node-line bg-node px-1 py-0.5 text-center font-heading text-[clamp(13px,3.5vw,18px)] leading-[1.1] font-semibold whitespace-normal shadow-[0_3px_8px_#00000006,inset_0_1px_0_var(--color-highlight)] first:border-accent min-[640px]:rounded-[14px] min-[640px]:text-[18px] min-[1024px]:gap-[clamp(3px,0.7svh,7px)] min-[1024px]:text-[clamp(11px,calc((100svh_-_240px)/36),18px)] ${topic.position}`}>
              <span className="max-w-full">{topic.name}</span>
              <span className="hidden font-body text-[10px] leading-[1.2] font-normal text-accent-text min-[400px]:block min-[400px]:text-[8px] min-[640px]:text-[10px] min-[1024px]:text-[clamp(7px,1.1svh,10px)]">{topic.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
