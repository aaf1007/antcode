import { mock, type TestContext } from "node:test";

type Catalog = Pick<
  typeof import("../../src/problems/problem.catalog.ts"),
  "listProblems" | "findProblem" | "findWorkbench"
>;

const emptyPage: Catalog["listProblems"] = async () => ({ problems: [], nextCursor: null });
const missingProblem: Catalog["findProblem"] = async () => null;
const listProblems = mock.fn(emptyPage);
const findProblem = mock.fn(missingProblem);
const unavailableWorkbench: Catalog["findWorkbench"] = async () => ({
  availability: "unavailable",
  reason: "missing_content",
});
const findWorkbench = mock.fn(unavailableWorkbench);

mock.module(new URL("../../src/problems/problem.catalog.ts", import.meta.url), {
  namedExports: { listProblems, findProblem, findWorkbench },
});

export function stubCatalog(t: TestContext, overrides: Partial<Catalog> = {}) {
  listProblems.mock.mockImplementation(overrides.listProblems ?? emptyPage);
  findProblem.mock.mockImplementation(overrides.findProblem ?? missingProblem);
  findWorkbench.mock.mockImplementation(overrides.findWorkbench ?? unavailableWorkbench);

  t.after(() => {
    listProblems.mock.mockImplementation(emptyPage);
    listProblems.mock.resetCalls();
    findProblem.mock.mockImplementation(missingProblem);
    findProblem.mock.resetCalls();
    findWorkbench.mock.mockImplementation(unavailableWorkbench);
    findWorkbench.mock.resetCalls();
  });
}
