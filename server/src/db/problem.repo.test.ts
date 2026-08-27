/**
 * Unit tests for the problem repository.
 *
 * These stub the Sequelize model rather than talking to Postgres, so they run
 * anywhere with no database. What they cover is the logic that actually lives
 * in this layer: which columns get requested, and how rows are converted to

 * database can verify.
 */
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { Problem as ProblemModel } from './models.js';
import { findAllSnippets, findProblemById } from './problem.repo.js';
import type { Problem, ProblemSnippet } from '../types/problem.js';

/** A stand-in for a Sequelize instance: only `toJSON` is ever called on it. */
function fakeRow<T>(attributes: T) {
  return { toJSON: () => attributes } as unknown as ProblemModel;
}

const SNIPPET: ProblemSnippet = {
  questionId: '217',
  title: 'Contains Duplicate',
  difficulty: 'Easy',
  topicTags: [{ name: 'Array', slug: 'array' }],
  acRate: 64.6,
};

afterEach(() => {
  mock.restoreAll();
});

describe('findAllSnippets', () => {
  it('returns plain objects, not Sequelize instances', async () => {
    mock.method(ProblemModel, 'findAll', async () => [fakeRow(SNIPPET)]);

    const [snippet] = await findAllSnippets();

    assert.deepEqual(snippet, SNIPPET);
    // A model instance would carry `dataValues`; a plain object must not.
    assert.equal(Object.hasOwn(snippet!, 'dataValues'), false);
  });

  it('selects only the snippet columns, not the large JSONB/TEXT ones', async () => {
    const findAll = mock.method(ProblemModel, 'findAll', async () => []);

    await findAllSnippets();

    const [options] = findAll.mock.calls[0]!.arguments;
    assert.deepEqual(options?.attributes, [
      'questionId',
      'title',
      'difficulty',
      'topicTags',
      'acRate',
    ]);
  });

  it('returns an empty array when the table is empty', async () => {
    mock.method(ProblemModel, 'findAll', async () => []);

    assert.deepEqual(await findAllSnippets(), []);
  });
});

describe('findProblemById', () => {
  it('looks the problem up by primary key', async () => {
    const findByPk = mock.method(ProblemModel, 'findByPk', async () => null);

    await findProblemById('217');

    assert.equal(findByPk.mock.calls[0]!.arguments[0], '217');
  });

  it('returns the problem as a plain object when found', async () => {
    const problem = { ...SNIPPET, content: null } as unknown as Problem;
    mock.method(ProblemModel, 'findByPk', async () => fakeRow(problem));

    assert.deepEqual(await findProblemById('217'), problem);
  });

  it('returns null when no problem matches', async () => {
    mock.method(ProblemModel, 'findByPk', async () => null);

    assert.equal(await findProblemById('does-not-exist'), null);
  });
});
