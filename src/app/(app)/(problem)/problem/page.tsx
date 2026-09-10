import ProblemList from '@/features/problems/components/ProblemList';

export default function ProblemsPage() {
  return (
    <main className="grid grid-cols-[minmax(1rem,1fr)_minmax(0,64rem)_minmax(1rem,1fr)] py-8 sm:py-12">
      <div className="col-start-2 min-w-0">
        <ProblemList />
      </div>
    </main>
  );
}
