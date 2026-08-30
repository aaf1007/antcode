import "server-only";

import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import type {
  CodeSnippet,
  Difficulty,
  NeetcodeMeta,
  TopicTag,
} from "./problem.types";
import { sequelize } from "@/lib/db/sequelize";

export class Problem extends Model<
  InferAttributes<Problem>,
  InferCreationAttributes<Problem>
> {
  declare questionId: string;
  declare questionFrontendId: string;
  declare title: string;
  declare titleSlug: string;
  declare difficulty: Difficulty;
  declare isPaidOnly: boolean;
  declare content: string | null;
  declare topicTags: TopicTag[];
  declare codeSnippets: CodeSnippet[];
  declare hints: string[];
  declare exampleTestcases: string;
  declare likes: number;
  declare dislikes: number;
  declare acRate: number;
  declare totalAccepted: string;
  declare neetcode: NeetcodeMeta;
}

Problem.init(
  {
    questionId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    questionFrontendId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleSlug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    difficulty: {
      type: DataTypes.ENUM("Easy", "Medium", "Hard"),
      allowNull: false,
    },
    isPaidOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    topicTags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    codeSnippets: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    hints: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    exampleTestcases: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    acRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    totalAccepted: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    neetcode: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Problems",
    tableName: "problems",
    timestamps: false,
    indexes: [{ fields: ["difficulty"] }],
  },
);
