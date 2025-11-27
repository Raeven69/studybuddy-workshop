**Project Overview**
- **Name:** StudyBuddy+
- **Goal:** Een lichte studieplanning- en taakmanager die gebruikers helpt study-taken te plannen, inschatten en bijhouden. De app ondersteunt het aanmaken van taken (titel, vak, geschatte minuten), status transitions (todo → in-progress → done) en (frontend) filtering en visualisatie.

**Project Structure**
- **Root**
  - `docker-compose.yml` — compose setup voor lokale ontwikkeling (indien gebruikt).
  - `TASK.md`, `TASK.md` — taak- en projectdocumentatie.
- **backend/** — Node.js + TypeScript API
  - `Dockerfile` — opsomming voor containerisatie.
  - `package.json` — scripts: `dev` (ts-node-dev), `build` (tsc), `start` (node dist).
  - `src/`
    - `index.ts` — Express server en REST routes (`/api/tasks`, CRUD + health).
    - `database.ts` — eenvoudige lokale opslaglaag (imported as `db` in `index.ts`).
    - `types.ts` — TypeScript interfaces voor `StudyTask`, `CreateTaskInput`, `TaskStatus`.
- **frontend/** — Next.js (App Router) React client in TypeScript
  - `Dockerfile`
  - `package.json` — Next.js 16, React 19, Tailwind, Radix UI, `react-hook-form`, `zod`, etc.
  - `pnpm-lock.yaml` — lockfile aanwezig (pnpm recommended for frontend).
  - `app/` — Next.js App Router (`layout.tsx`, `page.tsx`, global styles).
  - `components/` — UI components such as `add-task-form.tsx`, `task-card.tsx`, `study-dashboard.tsx`, `task-filters.tsx`.
  - `lib/` — client API helpers and shared types (`api.ts`, `types.ts`, `utils.ts`).
  - `public/`, `styles/` — assets and Tailwind global styles.

**How the parts map together**
- Frontend calls backend REST API on `http://<host>:<port>/api/tasks` to create/list/update/delete tasks.
- Shared notions: `Task` shape is represented separately in `backend/src/types.ts` and `frontend/lib/types.ts` — keep these in sync.
- The backend exposes a small, single-purpose API (in-memory or file-backed DB via `database.ts`), suitable for local dev and easy migration.

**Technology Stack**
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI, `react-hook-form`, optional `zod` for validation, pnpm lockfile present.
- **Backend:** Node.js + Express, TypeScript, `ts-node-dev` for dev experience. CORS enabled and JSON middleware configured.
- **DB / Storage:** Lightweight local DB module (`backend/src/database.ts`) — no external DB is required by default (suitable for PoC).
- **Dev tools:** TypeScript, ESLint (if present), PostCSS, Tailwind; Dockerfiles and `docker-compose.yml` are present for containerized runs.

**Coding Standards**
- **Language:** TypeScript across frontend and backend. Prefer typed interfaces over `any`.
- **Formatting:** Keep existing code style (2-space/4-space indentation consistent with repo). Run `tsc` to compile backend and `next lint` / `eslint` for frontend when available.
- **Types:** Define request/response shapes in `backend/src/types.ts` and mirror/update corresponding `frontend/lib/types.ts`.
- **Errors:** Validate input at the API boundary and return HTTP 4xx for client errors.
- **Accessibility:** Components in `components/` should be accessible (proper labels, keyboard navigation).
- **UI:** Use Tailwind utility classes already present; try to reuse existing component styles and patterns.

**Feature Development Guidelines**
- 1) Branching: create a feature branch from `opdracht-1-issue-maken` (or main if instructed).
- 2) Types first: add/extend TypeScript types in both `backend/src/types.ts` and `frontend/lib/types.ts` before implementation.
- 3) API contract: update backend routes (`src/index.ts`) and database access (`src/database.ts`) to accept and persist new fields. Validate and default values at the API layer.
- 4) Frontend: update `components/add-task-form.tsx` to include new inputs and ensure `onAddTask` sends the new field. Update `task-card.tsx` and `task-filters.tsx` to display and filter the new data.
- 5) Backwards compatibility: ensure API accepts requests without new fields and applies sensible defaults.
- 6) Tests: add unit tests for new logic and a small integration test for the create→read flow. Manual QA: test UI flows in `next dev` and backend with `npm run dev`.
- 7) Docs: update `TASK.md` and `README.md` to describe new behavior and migration steps.

**Recommended workflow for changes**
- Update types → update backend validation & DB → update frontend forms & API client → update UI → add tests → run manual QA → open PR.

**Environment / Run commands (local)**
- Backend (PowerShell):
```powershell
cd backend; npm install
npm run dev
```
- Frontend (PowerShell, recommended pnpm):
```powershell
cd frontend; pnpm install
pnpm dev
```
- Or use `docker-compose up --build` if you prefer containerized run (project has `docker-compose.yml`).

**Notes / To watch for**
- Keep the `Task` type in sync between frontend/backends.
- The backend currently uses a simple `database.ts` module; for production you may want to migrate to a real DB and add migrations.
- Frontend lockfile indicates `pnpm` is used for the client — use it to avoid lockfile mismatches.

---
If je wilt, ik kan nu automatisch:
- `add-task-form.tsx` uitbreiden met moeilijkheidsgraad-select,
- `frontend/lib/types.ts` en `backend/src/types.ts` updaten,
- en de backend API validatie + `database.ts` aanpassen.
Welke stap wil je dat ik eerst uitvoer?