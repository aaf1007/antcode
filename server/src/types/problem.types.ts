import type { FieldOutputTypes } from "../db/prisma/contract.d.ts";

type ProblemRow = FieldOutputTypes["public"]["Problem"];

export type ProblemItem = ProblemRow;
export type Difficulty = ProblemRow["difficulty"];
export type Category = ProblemRow["category"];

export type ProblemListItem = Pick<
  ProblemRow,
  | "problemId"
  | "frontendId"
  | "title"
  | "url"
  | "difficulty"
  | "category"
  | "isPremium"
  | "acRate"
>;

export type ProblemList = ProblemListItem[];

export type ProblemPageOptions = { limit?: number; after?: number };

export type ProblemPage = { problems: ProblemList; nextCursor: number | null };
