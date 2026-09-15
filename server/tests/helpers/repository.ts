import { mock, type TestContext } from "node:test";

type Repository = Pick<typeof import("../../src/db/problem.repository.ts"), "getProblemPage" | "getProblemItem">;

const emptyPage: Repository["getProblemPage"] = async () => [];
const missingProblem: Repository["getProblemItem"] = async () => null;
const getProblemPage = mock.fn(emptyPage);
const getProblemItem = mock.fn(missingProblem);

// Keep the service and HTTP stack real while replacing the database boundary.
mock.module(new URL("../../src/db/problem.repository.ts", import.meta.url), {
  namedExports: { getProblemPage, getProblemItem },
});

export function stubRepository(t: TestContext, overrides: Partial<Repository> = {}) {
  getProblemPage.mock.mockImplementation(overrides.getProblemPage ?? emptyPage);
  getProblemItem.mock.mockImplementation(overrides.getProblemItem ?? missingProblem);
  t.after(() => {
    getProblemPage.mock.mockImplementation(emptyPage);
    getProblemPage.mock.resetCalls();
    getProblemItem.mock.mockImplementation(missingProblem);
    getProblemItem.mock.resetCalls();
  });
}
