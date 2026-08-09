export type Difficulty = "Easy" | "Medium" | "Hard";

export type TopicTag = {
    name: string;
    slug: string;
};

export type CodeSnippet = {
    lang: string;
    langSlug: string;
    code: string;
};

/** NeetCode curation metadata attached to each problem. */
export type NeetcodeMeta = {
    blind75: boolean;
    neetcode150: boolean;
    /** e.g. "Arrays & Hashing" */
    category: string;
    categoryOrder: number;
    orderInCategory: number;
    /** YouTube video id for the walkthrough. */
    videoId: string;
};

// Mirrors an entry in db/problems.json — field order matches the file.
export type Problem = {
    questionId: string;
    questionFrontendId: string;
    title: string;
    titleSlug: string;
    difficulty: Difficulty;
    isPaidOnly: boolean;
    /** null for the paid-only problems, whose body isn't available. */
    content: string | null;
    topicTags: TopicTag[];
    codeSnippets: CodeSnippet[];
    /** Often empty — most problems ship no hints. */
    hints: string[];
    /** Newline-separated sample inputs. */
    exampleTestcases: string;
    likes: number;
    dislikes: number;
    /** Acceptance rate as a percentage, e.g. 64.6 */
    acRate: number;
    /** Human-formatted submission count, e.g. "6.8M". */
    totalAccepted: string;
    neetcode: NeetcodeMeta;
};

// Data shown when displaying list of problems in client
export type ProblemSnippet = {
    questionId: string,
    title: string,
    difficulty: Difficulty,
    topicTags: TopicTag[],
    acRate: number
};

export type ProblemPagination = {
    problems: ProblemSnippet[],
    hasMore: Boolean,
};
