# AntCode Architecture Recommendation

## Decision

Build AntCode as a **modular monolith with a separately deployed code-execution plane**.

Keep accounts, problems, submissions, progress, and judging orchestration in one codebase and API initially. Run untrusted user code in separate workers and disposable sandboxes or microVMs.

```text
Browser
   │
   ▼
Stateless API
   ├── Accounts
   ├── Problems
   ├── Submissions
   ├── Progress
   └── Judging orchestration
           │
           ▼
      PostgreSQL
   Submission + Outbox
           │
           ▼
     Durable Job Queue
           │
           ▼
      Judge Workers
           │
           ▼
 Disposable Sandbox/VM
```

## Why This Architecture

### 1. Avoid premature microservices

Separate network services would immediately add:

- Distributed transactions
- Service discovery
- Inter-service authentication
- More deployments
- Network failure handling
- Distributed tracing
- Contract-version coordination
- Harder local development

AntCode does not need those costs yet.

A modular monolith provides clear ownership while keeping transactions and development simple. Modules can later become services if operational evidence justifies it.

### 2. Isolate code execution early

Code execution has genuinely different requirements from the API:

- It runs untrusted code.
- It consumes significant CPU and memory.
- It must be independently scalable.
- It has stronger security requirements.
- It can fail or time out without affecting API availability.

This is a real deployment seam, so judge workers and sandboxes should be separate processes from the beginning.

### 3. Organize around capabilities

Do not require every feature to use a rigid:

```text
router → service → repository
```

Instead, organize code into vertical feature modules with small interfaces and deep implementations.

```text
server/src/modules/
  problems/
    problem.routes.ts
    problem.catalog.ts
    problem.types.ts

  accounts/
    account.routes.ts
    accounts.ts
    account.types.ts

  submissions/
    submission.routes.ts
    submit.ts
    submission-status.ts
    submission.types.ts

  judging/
    judge-submission.ts
    verdict.ts
    judge.types.ts

  execution/
    execute.ts
    execution.types.ts
```

A repository can exist internally when persistence is complex, but it should not be a mandatory pass-through layer.

## Module Interfaces

Examples of deliberately small interfaces:

```ts
listProblems(cursor): Promise<ProblemPage>
findProblem(problemId): Promise<Problem | null>

submitSolution(command): Promise<Submission>
getSubmission(submissionId, user): Promise<Submission | null>

judgeSubmission(submissionId): Promise<Verdict>
execute(request): Promise<ExecutionResult>
```

Routes should handle HTTP concerns only:

- Reading parameters
- Authentication
- Calling the relevant module
- Translating results into HTTP responses

The module should own application behavior, persistence translation, validation, and invariants.

## Domain Terminology

### Problem

The identity and current metadata of a coding problem.

### Problem Version

An immutable revision containing:

- Statement revision
- Visible and hidden tests
- Time and memory limits
- Judge configuration
- Comparator behavior
- Supported language/runtime versions

### Run

Execution of code against user-provided input. It does not produce an official verdict.

### Submission

An immutable request from a user to judge source code against a specific Problem Version.

### Execution

Running code in an isolated environment and collecting resource and output information.

```ts
type ExecutionResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  durationMs: number;
  memoryBytes: number;
  outcome:
    | "completed"
    | "timed_out"
    | "memory_exceeded"
    | "failed";
};
```

### Judging

Loading test cases, invoking execution, comparing results, and producing a verdict.

Possible verdicts:

```text
Accepted
Wrong Answer
Compilation Error
Runtime Error
Time Limit Exceeded
Memory Limit Exceeded
Internal Error
```

## Submission Workflow

1. The API authenticates and rate-limits the user.
2. The Submissions module validates the language and Problem Version.
3. One database transaction:
   - Creates the Submission in `queued` state.
   - Creates an outbox event.
4. An outbox dispatcher publishes the judging job.
5. A judge worker claims the job.
6. The worker loads the immutable Problem Version and test bundle.
7. The worker invokes an isolated sandbox.
8. The worker calculates and stores the verdict.
9. The browser receives updates through polling, SSE, or WebSockets.

```text
POST /submissions
       │
       ▼
Database transaction
  ├── Insert Submission
  └── Insert Outbox Event
       │
       ▼
Outbox Dispatcher
       │
       ▼
Job Queue
       │
       ▼
Judge Worker
       │
       ▼
Sandbox/VM
       │
       ▼
Persist Verdict
```

## Why Use a Transactional Outbox?

This sequence is unsafe:

```text
Insert submission
Process crashes
Job is never enqueued
```

Enqueueing before committing the database row is also unsafe because the worker could receive a job for a submission that does not exist.

A transactional outbox writes the Submission and queue event in the same database transaction. A dispatcher safely publishes committed events afterward.

## Submission State Model

Use an explicit state machine:

```text
queued
  → running
  → accepted
  → wrong_answer
  → compilation_error
  → runtime_error
  → timed_out
  → memory_exceeded
  → internal_error
```

Store execution attempts separately:

```text
Submission
  ├── ExecutionAttempt 1
  └── ExecutionAttempt 2
```

Queues normally provide at-least-once delivery. Workers must therefore be idempotent so duplicate jobs cannot create conflicting verdicts.

## Problem Versioning

A Submission must reference an immutable Problem Version rather than only the current Problem.

Without versioning:

1. A user submits code.
2. A hidden test changes.
3. The job is retried.
4. The same submission produces a different verdict.

Versioning provides reproducibility and makes retries, debugging, and rejudging reliable.

## Execution Security

The API must never execute user code directly.

Each execution environment should have:

- No network access by default
- No database or queue credentials
- An unprivileged operating-system user
- CPU limits
- Memory limits
- Process-count limits
- Output-size limits
- A wall-clock timeout
- A read-only base filesystem
- An ephemeral writable directory
- No host filesystem mounts
- Destruction after every execution

The judge worker is the **control plane**. The sandbox or VM is the **execution plane**.

The execution plane should receive only:

- Source code
- Runtime configuration
- Input or test bundle
- Resource limits

It should never receive direct access to AntCode’s database.

## Containers vs. MicroVMs

### Containers

Benefits:

- Fast startup
- Lower cost
- Easier development

Tradeoff:

- Weaker isolation for hostile, multi-tenant workloads unless heavily hardened

### MicroVMs

Benefits:

- Stronger isolation
- Better security seam for untrusted code

Tradeoffs:

- Higher startup latency
- Greater infrastructure complexity
- Higher resource cost

A reasonable progression is hardened containers for early controlled use, followed by microVMs before exposing unrestricted multi-tenant execution.

## Queue Strategy

A PostgreSQL-backed durable queue is reasonable initially because AntCode already operates PostgreSQL.

Benefits:

- Less infrastructure
- Easier local development
- Good transactional integration
- Simple deployment

Create a queue interface with:

- A production durable adapter
- An in-memory test adapter

At larger scale, the production adapter can move to SQS, RabbitMQ, or another dedicated queue without changing submission or judging logic.

Use separate priorities:

```text
interactive-runs     High priority
user-submissions     Normal priority
bulk-rejudge         Low priority
```

This prevents bulk work from delaying interactive code runs.

## Data Ownership

| Module | Owns |
|---|---|
| Accounts | Users, identities, roles, quotas |
| Problems | Catalog and immutable Problem Versions |
| Submissions | User source, language, state, verdict |
| Judging | Test orchestration and verdict calculation |
| Execution | Runtime requests and resource measurements |
| Progress | Solved problems, streaks, learning progress |

Hidden test cases must never be part of a browser-facing Problem representation. Only judge workers should have credentials capable of accessing them.

Large logs, artifacts, and test bundles should eventually use object storage rather than PostgreSQL.

## Scaling Plan

### Early Stage

- One API process
- One PostgreSQL database
- PostgreSQL-backed queue
- Small judge-worker pool
- Browser polls submission status

### Growing Traffic

- Multiple stateless API replicas
- Worker autoscaling based on queue depth
- Database connection pooling
- Separate Run and Submission queues
- Object storage for logs and artifacts
- SSE for submission updates
- Per-user quotas and rate limits

### Large Scale

- Dedicated queue infrastructure
- Regional sandbox pools
- Language-specific worker pools
- Read replicas for catalog traffic
- CDN-backed Problem representations
- Independent judge-control deployment
- Selective module extraction where load or team ownership requires it

## Important Tradeoffs

### Modular Monolith

Benefits:

- Simple transactions
- Easier refactoring
- Fewer deployments
- Better local development
- Strong feature locality

Tradeoff:

- Module isolation depends on code discipline rather than network boundaries

### Separate Judge Workers

Benefits:

- Independent scaling
- Security isolation
- API remains responsive during execution spikes

Tradeoffs:

- Eventual consistency
- Queue management
- Retry and idempotency requirements
- Additional observability requirements

### Transactional Outbox

Benefits:

- Reliable database-to-queue delivery
- Prevents lost and orphaned jobs

Tradeoffs:

- Additional table and dispatcher
- Small delivery delay
- Requires cleanup and monitoring

### Disposable VMs

Benefits:

- Strong security isolation
- Predictable execution resources

Tradeoffs:

- Startup latency
- Infrastructure complexity
- Increased cost

## Recommended Direction for the Current Codebase

Use:

```text
Problem Route
    → Problem Catalog Module
        → Prisma
```

For submissions:

```text
Submission Route
    → Submissions Module
        ├── PostgreSQL Transaction
        └── Outbox Event
```

For judging:

```text
Queue Adapter
    → Judge Module
        → Sandbox Interface
            → VM Adapter
```

The system should scale through clear module interfaces, stateless API replicas, durable queues, and independently scalable execution workers—not through pass-through layers or premature microservices.
