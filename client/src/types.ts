export type ProblemPagination = {
    problems: ProblemSnippet[],
    hasMore: boolean,
};

export type ProblemSnippet = {
    questionId: string,
    title: string,
    difficulty: "Easy" | "Medium" | "Hard",
    topictags: TopicTag[],
    acrate: number
};

export type TopicTag = {
    name: string;
    slug: string;
};
