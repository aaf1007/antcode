import "server-only";

import type { Problem, ProblemSnippet } from "./problem.types";
import { sequelize } from "@/lib/db/sequelize";
import { Problem as ProblemModel } from "./problem.model";

// create the 'Problem' table if it does not exist yet
export async function init(): Promise<void> {
  await sequelize.sync();
}

export async function findAllSnippets(): Promise<ProblemSnippet[]> {
  const rows = await ProblemModel.findAll({
    attributes: ["questionId", "title", "difficulty", "topicTags", "acRate"],
  });
  return rows.map((row) => row.toJSON());
}

export async function findProblemById(problemId: string): Promise<Problem | null> {
  const row = await ProblemModel.findByPk(problemId);
  return row ? row.toJSON() : null;
}
