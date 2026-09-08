'use client';

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
    const [isPressed, setIsPressed] = useState<boolean>(false);

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

    // Load the next page when 'Load More Problems' button is pressed
    useEffect(() => {
        if (isPressed && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
            setIsPressed(false);
        }
    }, [isPressed, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const problems = data?.pages.flatMap((page) => page.problems) ?? [];

    if (isPending) {
        return (
            <div className="flex justify-center py-16">
                <LoadingDots />
            </div>
        );
    }

    if (isError) {
        return <p className="text-danger text-sm">{error.message}</p>;
    }

    return (
        <>
            <div className="bg-surface border border-line rounded-lg overflow-hidden">
                <ul>
                    {problems.map((problem) => (
                        <ProblemCard key={problem.problemId} problem={problem} />
                    ))}
                </ul>

                {isFetchingNextPage ? (
                    <div className="flex justify-center py-4 text-ink/70 text-sm">
                        <LoadingDots />
                    </div>
                    ) : null}
                    
                {!hasNextPage && !isFetchingNextPage ? (
                    <div className="flex justify-center py-4 text-ink/70 text-sm">
                        <p>End of the list.</p>
                    </div>
                ) : null}
            </div>
            
            <div className="flex justify-center py-15">
                <LoadMoreButton onClick={() => setIsPressed(true)} />
                {isPressed ? <LoadMoreButton onClick={() => setIsPressed(true)} /> : null}
            </div>
        </>
    );
}

/** Three-dot pulse used for initial and next-page loading. */
function LoadingDots() {
    return (
        <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
            <span className="bg-ink/50 rounded-full size-1.5 loading-dot" />
            <span className="bg-ink/50 rounded-full size-1.5 loading-dot" />
            <span className="bg-ink/50 rounded-full size-1.5 loading-dot" />
        </div>
    );
}

function LoadMoreButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex justify-center items-center hover:bg-ink/5 px-4 py-2 hover:border-ink/40 rounded-md focus:outline-none focus:ring-2 focus:ring-ink/20 font-medium text-sm transition-all duration-200 text-accent-text cursor-pointer"
        >
            Load More Problems
        </button>
    );
}
