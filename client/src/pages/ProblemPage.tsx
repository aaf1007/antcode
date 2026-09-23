import { useParams } from "react-router";
import ProblemDetail from "@/features/problems/components/ProblemDetail";

export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  return <ProblemDetail slug={slug!} />;
}
