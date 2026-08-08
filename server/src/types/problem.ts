export type Difficulty = "Easy" | "Medium" | "Hard";

export type TopicTag = {
    name: string;
};

export type CodeSnippet = {
    lang: string;
    langSlug: string;
    code: string;
    langsSlug: string;
};

export type ProblemSolution = {
    canSeeDetail: boolean;
    content: string | null;
};

export type Problem = {
    questionId: string;
    questionFrontendId: string;
    title: string;
    content: string;
    likes: number;
    dislikes: number;
    /** JSON string of acceptance stats. */
    stats: string;
    /** JSON string of similar question objects. */
    similarQuestions: string;
    categoryTitle: string;
    hints: string[];
    topicTags: TopicTag[];
    companyTags: TopicTag[] | null;
    difficulty: Difficulty;
    isPaidOnly: boolean;
    codeSnippets: CodeSnippet[];
    solution: ProblemSolution;
    hasSolution: boolean;
    hasVideoSolution: boolean;
    url: string;
};

// Data shown when displaying list of problems in client
export type ProblemSnippet = {
    questionId: string,
    title: string,
    difficulty: Difficulty,
    topicsTags:  {
        name: string,
        slug: string
    }[],
    acceptanceRate: string
};

export type ProblemPagination = {
    problems: ProblemSnippet[],
    hasMore: Boolean,
};