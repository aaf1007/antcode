import { useParams } from "react-router";
import ProblemDetail from "@/features/problems/components/ProblemDetail";

export default function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <ProblemDetail problemId={problemId!} />
    </main>
  );
}
