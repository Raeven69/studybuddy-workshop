# Add Difficulty Selector to Task Creation

Feature: add a difficulty selector to tasks with options `Makkelijk` / `Gemiddeld` / `Moeilijk` (normalized values `easy` / `medium` / `hard`).

Purpose
- Allow students to mark tasks with an estimated difficulty to improve prioritization and scheduling.

Quality target
- Follow existing project conventions (TypeScript types, in-memory DB, REST API responses). Provide clear validation, defaults, and UI display.

--

## 0. Task Analysis
- Source: `TASK-final.md` (root) — feature requested: add difficulty selector and persist/validate it.
- Scope:
  - Frontend: add select in `AddTaskForm`, present difficulty on `TaskCard` and dashboard.
  - Backend: add `difficulty` to types and validation in `POST /api/tasks` and `PATCH /api/tasks/:id`.
  - Database: store `difficulty` on in-memory tasks, default `medium` for existing tasks.

Constraints:
- Keep backwards compatibility: existing tasks without `difficulty` should behave as `medium`.
- Use normalized values in API (`easy`, `medium`, `hard`) while showing localized labels in UI.

--

## 1. Codebase Analysis (files & patterns)
Below are the key files to change and patterns to mirror. Include the exact file paths so implementer finds them quickly.

- Backend
  - `backend/src/types.ts` — current types:
    ```ts
    export type TaskStatus = "todo" | "in-progress" | "done";

    export interface StudyTask {
      id: string;
      title: string;
      subject: string;
      estimatedMinutes: number;
      status: TaskStatus;
      createdAt: string;
    }

    export interface CreateTaskInput {
      title: string;
      subject: string;
      estimatedMinutes: number;
    }
    ```
    Pattern: small discriminated string unions and plain interfaces. Update here to include `difficulty?: "easy" | "medium" | "hard"` on both `StudyTask` and `CreateTaskInput` (optional on input).

  - `backend/src/database.ts` — in-memory seeded tasks and `Database.createTask` implementation. Current createTask signature uses `Omit<StudyTask, "id" | "status" | "createdAt">` and sets `status: "todo"` and `createdAt` server-side. Mirror this pattern and set `difficulty` default to `"medium"` in `createTask` and in `INITIAL_TASKS` seed.

  - `backend/src/index.ts` — express routes. Current POST `/api/tasks` validates required fields and uses `db.createTask(input)`. Update validation to accept `difficulty` if present and reject invalid values (400). Also update `PATCH /api/tasks/:id` to validate `difficulty` if provided.

- Frontend
  - `frontend/components/add-task-form.tsx` — client component using `CreateTaskInput` from `frontend/lib/types` (`@/lib/types`). Pattern: controlled form state, validation (minutes numeric), sends normalized object to `onAddTask`. Add `difficulty` field to form state and include in POST payload as normalized string.

  - `frontend/components/task-card.tsx` — displays `StudyTask` fields (`title`, `subject`, `estimatedMinutes`, `status`). Add a UI element (small badge or text) to show difficulty (localized label) next to subject/estimate.

  - `frontend/lib/types.ts` — file that defines frontend types to match backend. Update to include `difficulty` in `StudyTask` and `CreateTaskInput` types.

Patterns to follow
- Keep validation simple and consistent: return HTTP 400 with `{ error: string }` body for invalid requests (see existing handlers in `backend/src/index.ts`).
- For defaulting values, set on server side in `db.createTask` to keep clients lightweight.

--

## 2. External Research & References
- HTML select accessible pattern (labeling, required): MDN Select element
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
- Accessible form controls and labels: WAI-ARIA authoring practices
  - https://www.w3.org/WAI/ARIA/apg/patterns/label/
- Next.js client components guidance (using "use client") — relevant to `add-task-form.tsx` which is already client component
  - https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#client-components
- Express validation: lightweight validation in existing project — follow pattern already used in `backend/src/index.ts` (manual checks). Consider a small helper array of allowed difficulties.

--

## 3. Implementation Blueprint (ordered tasks)
Each step includes file paths and minimal code hints.

1) Update types (backend + frontend)
   - Edit `backend/src/types.ts`
     - Add:
       ```ts
       export type Difficulty = "easy" | "medium" | "hard";

       export interface StudyTask { ... difficulty: Difficulty }

       export interface CreateTaskInput { ... difficulty?: Difficulty }
       ```
   - Edit `frontend/lib/types.ts` to match the backend `StudyTask` and `CreateTaskInput` shape (same `Difficulty` union).

2) Update in-memory DB
   - Edit `backend/src/database.ts`:
     - Update `INITIAL_TASKS` entries to include `difficulty: "medium"` for all seeded tasks.
     - Modify `createTask` signature to accept `difficulty` optional and set default `difficulty: "medium"` when missing.
     - Update `updateTask` usage is generic (Partial<StudyTask>) so no change required beyond ensuring DB objects include the field.

3) Update API validation and routes
   - Edit `backend/src/index.ts`:
     - For `POST /api/tasks`: validate `difficulty` if provided against allowed values `['easy','medium','hard']`. On missing, rely on `db.createTask` default.
     - For `PATCH /api/tasks/:id`: accept updates containing `difficulty` and validate values if present. Return `400` for invalid difficulty and `404` when updating a non-existing task (consistent with existing behavior).

4) Update frontend form and types
   - Edit `frontend/components/add-task-form.tsx`:
     - Add `difficulty` to local `formData` state (default `medium`), render a `<select>` with options labeled `Makkelijk`, `Gemiddeld`, `Moeilijk` and values `easy`,`medium`,`hard`.
     - Include `difficulty` when calling `onAddTask({...})`.
   - Update any UI text if necessary (button labels unaffected).

5) Display difficulty in UI
   - Edit `frontend/components/task-card.tsx` to render difficulty as a small badge or text within the metadata area (near subject/estimatedMinutes). Use a color or subtle text style. Map normalized difficulty to localized labels.

6) (Optional) Update task editing endpoints / UI
   - If there is a task edit UI, add ability to change difficulty (not present in current codebase by default). The `PATCH` endpoint will support it.

7) Tests & Manual validation
   - Add unit tests for backend validation (simple test harness or manual curl/PowerShell commands below). Project currently has no test runner in repo; use manual validation instructions.

--

## 4. Error Handling & Edge Cases
- Validate `difficulty` values strictly using an allowed set: `['easy','medium','hard']`.
- If client submits an unknown string, return `400` with `{ error: 'Invalid difficulty' }`.
- If `difficulty` is missing on create, set server-side default `medium`.
- Ensure seeded tasks include `difficulty` so `getAllTasks()` always returns the field.
- Backward compatibility: frontend should handle tasks coming from API that might not have `difficulty` (defensive code: treat undefined as `medium`). But server will seed and default.

--

## 5. Validation Gates (how to verify)
Run the server and perform these checks. The repo uses `backend/package.json` — confirm the start script. If not, run via `ts-node` or `node` after build.

Manual test commands (PowerShell):

```powershell
# Start backend (from repo root)
cd backend; npm install; npm run dev

# Create a task with difficulty
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/tasks -ContentType 'application/json' -Body ('{"title":"Sample","subject":"Math","estimatedMinutes":30,"difficulty":"hard"}') | ConvertTo-Json

# Create a task with invalid difficulty (expect HTTP 400)
try { Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/tasks -ContentType 'application/json' -Body ('{"title":"Bad","subject":"Test","estimatedMinutes":10,"difficulty":"extreme"}') } catch { $_.Exception.Response | Select-Object -ExpandProperty StatusCode }

# Get tasks and validate each has a difficulty field
Invoke-RestMethod -Method Get -Uri http://localhost:3001/api/tasks | ConvertTo-Json
```

Automated gates (if tests are added):
- `npm test` — add a lightweight Mocha/Jest suite for `backend` validating createTask behavior.
- `npm run lint` — respect repo linting if present.

--

## 6. Code Examples (patch-level hints)

- Update `backend/src/types.ts` snippet:
```diff
export type TaskStatus = "todo" | "in-progress" | "done";

export type Difficulty = "easy" | "medium" | "hard";

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  status: TaskStatus;
  createdAt: string;
  difficulty: Difficulty;
}

export interface CreateTaskInput {
  title: string;
  subject: string;
  estimatedMinutes: number;
  difficulty?: Difficulty;
}
```

- Update `backend/src/database.ts` createTask defaulting:
```diff
createTask(input: Omit<StudyTask, "id" | "status" | "createdAt">): StudyTask {
  const newTask: StudyTask = {
    ...input,
    id: String(this.nextId++),
    status: "todo",
    createdAt: new Date().toISOString(),
    difficulty: input.difficulty ?? "medium",
  };
  this.tasks.push(newTask);
  return newTask;
}
```

- Update `backend/src/index.ts` POST handler validation example:
```diff
const allowed = ["easy","medium","hard"];
if (input.difficulty && !allowed.includes(input.difficulty)) {
  return res.status(400).json({ error: "Invalid difficulty" });
}
```

- Update `frontend/components/add-task-form.tsx` to include `difficulty` in state and form submission.

--

## 7. Integration Points
- `frontend/lib/api.ts` — check how tasks are posted; update calls to include `difficulty` if wrapper exists. (file present in repo root `frontend/lib/api.ts` — implementer should inspect it.)
- `frontend/lib/types.ts` — sync changes with backend types.

--

## 8. Testing Considerations
- Unit tests: backend validator for `difficulty`.
- Integration: start backend and use `Invoke-RestMethod` or `curl` to POST tasks; verify difficulty field present on GET.
- Frontend manual test: start Next app and create tasks via UI, verify cards show difficulty.

--

## 9. Deliverables
- `backend/src/types.ts` — updated types
- `backend/src/database.ts` — seeded tasks with `difficulty`, defaulting in `createTask`
- `backend/src/index.ts` — validation for POST/PATCH
- `frontend/lib/types.ts` — updated types
- `frontend/components/add-task-form.tsx` — select input and payload update
- `frontend/components/task-card.tsx` — display difficulty
- docs: this implementation plan `docs/implementation-plans/add-difficulty-selector.md`

--

## 10. Quality Checklist
- [x] All necessary context included (files, patterns, endpoints)
- [x] Validation gates and manual test commands provided
- [x] References to existing project patterns (type interfaces, in-memory DB)
- [x] Ordered implementation path provided
- [x] Error handling for invalid inputs documented
- [x] Main flow and alternate scenarios covered

Confidence score: 8/10

Rationale: the plan contains concrete file-level instructions, API examples, and manual validation steps. Score is not 10 because the repo currently lacks automated tests and project-level scripts for running the backend/frontend that might require slight commands changes — an implementing agent may need to confirm start scripts and exact `package.json` scripts. Adding an automated test stub and verifying `frontend/lib/api.ts` call shapes would raise confidence to 9-10.

Suggested improvements to reach 10/10:
- Add a small automated backend unit test that asserts `createTask` defaults and validation.
- Verify `frontend/lib/api.ts` request shapes and include a code snippet to update it if it transforms fields.
- Add end-to-end test instructions using Playwright or Cypress to validate UI flow.

--

Date: 2025-11-27