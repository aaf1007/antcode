'use client';

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import type { ProblemList } from "../problem.types";
import { ProblemCard } from "./ProblemCard";

type ProblemPage = {
    problems: ProblemList;
    nextCursor: number | null;
};

async function fetchProblems({ pageParam }: { pageParam: number | null }): Promise<ProblemPage> {
    const searchParams = new URLSearchParams();

    if (pageParam !== null) {
        searchParams.set("after", String(pageParam));
    }

    const response = await fetch(`/api/problem?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to load problems.");
    }

    return response.json() as Promise<ProblemPage>;
}

export default function ProblemList() {
    const { ref, inView } = useInView();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isError,
        isFetchingNextPage,
        isPending,
    } = useInfiniteQuery({
        queryKey: ['problems'],
        queryFn: fetchProblems,
        initialPageParam: null as number | null,
        getNextPageParam: (currentPage) => currentPage.nextCursor,
    });

    // Load the next page when the sentinel scrolls into view.
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const problems = data?.pages.flatMap((page) => page.problems) ?? [];

    if (isPending) {
        return (
            <div className="flex justify-center py-16">
                <LoadingDots />
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-danger">{error.message}</p>;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <ul>
                {problems.map((problem) => (
                    <ProblemCard key={problem.problemId} problem={problem} />
                ))}
            </ul>

            <div ref={ref} className="flex justify-center py-4 text-sm text-ink/70">
                {isFetchingNextPage ? <LoadingDots /> : null}
                {!hasNextPage && !isFetchingNextPage ? <p>End of the list.</p> : null}
            </div>
        </div>
    );
}

/** Three-dot pulse used for initial and next-page loading. */
function LoadingDots() {
    return (
        <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
            <span className="loading-dot size-1.5 rounded-full bg-ink/50" />
            <span className="loading-dot size-1.5 rounded-full bg-ink/50" />
            <span className="loading-dot size-1.5 rounded-full bg-ink/50" />
        </div>
    );
}
