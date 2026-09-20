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
  frontendId: number;
  title: string;
  url: string;
  difficulty: Difficulty;
  category: Category;
  isPremium: boolean;
  acRate: number;
};

export type ProblemItem = ProblemListItem & {
  slug: string;
  contentText: string | null;
  exampleInputFirst: string;
  likes: number;
  dislikes: number;
  totalAccepted: number;
  totalSubmitted: number;
};

export type ProblemList = ProblemListItem[];

export type ProblemPage = {
  problems: ProblemList;
  nextCursor: number | null;
};
