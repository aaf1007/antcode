import type { FieldOutputTypes } from "../../../database/prisma/contract.d";

type ProblemRow = FieldOutputTypes["public"]["Problem"];

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
