import ProblemDetail from "@/features/problems/components/ProblemDetail";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <ProblemDetail problemId={problemId} />
    </main>
  );
}
