export type Difficulty = "Easy" | "Medium" | "Hard";

export type Category =
  | "Algorithms"
  | "Database"
  | "Shell"
  | "Concurrency"
  | "JavaScript"
  | "pandas";

export type ProblemListItem = {
  problemId: string;
  slug: string;
  frontendId: number;
  title: string;
  url: string;
  difficulty: Difficulty;
  category: Category;
  isPremium: boolean;
  acRate: number;
};

export type ProblemItem = ProblemListItem & {
  contentText: string | null;
  exampleInputFirst: string;
  likes: number;
  dislikes: number;
  totalAccepted: number;
  totalSubmitted: number;
};

export type WorkbenchLanguageSlug = "python3" | "javascript" | "java";

export type WorkbenchPayload =
  | {
      availability: "ready";
      languages: Array<{
        slug: WorkbenchLanguageSlug;
        name: string;
        starterCode: string;
      }>;
      testCases: Array<{
        index: number;
        input: string;
        expected: string;
      }>;
    }
  | {
      availability: "unavailable";
      reason: "premium" | "unsupported_category" | "missing_content";
    };

export type ProblemDetailResponse = {
  problem: ProblemItem;
  workbench: WorkbenchPayload;
};

export type ProblemList = ProblemListItem[];

export type ProblemPage = {
  problems: ProblemList;
  nextCursor: number | null;
};
