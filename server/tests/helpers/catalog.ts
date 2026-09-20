import { mock, type TestContext } from "node:test";

type Catalog = Pick<
  typeof import("../../src/problems/problem.catalog.ts"),
  "listProblems" | "findProblem"
>;

const emptyPage: Catalog["listProblems"] = async () => ({ problems: [], nextCursor: null });
const missingProblem: Catalog["findProblem"] = async () => null;
const listProblems = mock.fn(emptyPage);
const findProblem = mock.fn(missingProblem);

mock.module(new URL("../../src/problems/problem.catalog.ts", import.meta.url), {
  namedExports: { listProblems, findProblem },
});

export function stubCatalog(t: TestContext, overrides: Partial<Catalog> = {}) {
  listProblems.mock.mockImplementation(overrides.listProblems ?? emptyPage);
  findProblem.mock.mockImplementation(overrides.findProblem ?? missingProblem);

  t.after(() => {
    listProblems.mock.mockImplementation(emptyPage);
    listProblems.mock.resetCalls();
    findProblem.mock.mockImplementation(missingProblem);
    findProblem.mock.resetCalls();
  });
}
