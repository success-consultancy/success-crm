# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Intelligence (CodeGraph)

This repo is indexed by **CodeGraph** — a SQLite knowledge graph of every symbol, edge, and file (`.codegraph/` at the repo root). When locating or understanding code, reach for it **before** grep/find or reading files:

- **MCP tool** (preferred when available): `codegraph_explore` — one call returns the relevant symbols' verbatim, line-numbered source plus the call paths and blast radius between them (including dynamic-dispatch hops grep can't follow).
- **Shell** (always works): `codegraph explore "<symbols or question>"` prints the same output. `codegraph status` shows index health.

**Re-indexing:** a background daemon watches the filesystem and **auto-syncs the graph on every file edit** — no manual step for normal work. Manually rebuild only when the index looks stale or after large/structural changes (big refactors, branch switches, dependency installs, mass file moves):

```bash
codegraph sync     # incremental — sync changes since last index
codegraph index    # full rebuild from scratch (same as a fresh init)
codegraph status   # verify: file/node/edge counts and "up to date" state
```

`.codegraph/` is git-ignored except its own `.gitignore` — never commit the database, sockets, logs, or PID.

## General Behavior Rules

- **Always ask before acting when context is unclear or more information is needed.** Never guess or dive in directly — ask clarifying questions first.
- **Before making decisions that could meaningfully affect the outcome** (e.g. architecture choices, ambiguous requirements, destructive operations), ask the user to confirm or clarify upfront.

## Commands

```bash
bun run dev          # Start dev server on port 3001
bun run build        # Production build
bun run lint         # ESLint check
bun run format       # Prettier format
```

> No test suite is configured. `.husky/pre-push` runs `npm run build` before every push — a broken build blocks the push, not the commit.

## Architecture Overview

This is a **CRM application** for education/visa consulting firms, built with Next.js 15 App Router, React 19, TypeScript, and Bun runtime.

### Route Groups

- `(auth)` — Login, forgot-password, reset-password (unauthenticated)
- `(dashboard-layout)` — All protected routes; features: leads, education, visa, tribunal-review, skill, appointment
- `(public-layout)` — Public-facing pages

Each feature follows the same CRUD pattern:
```
/[feature]/page.tsx              # List view
/[feature]/add/page.tsx          # Create form
/[feature]/[id]/view/page.tsx    # Read-only view
/[feature]/[id]/edit/page.tsx    # Edit form
/[feature]/_components/          # Feature-specific components
```

### Data Layer

- **`src/query/`** — React Query hooks for GET operations (e.g., `useGetLeads`)
- **`src/mutations/`** — React Query hooks for POST/PUT/DELETE
- **`src/constants/query-keys.ts`** — Centralized cache key constants
- **`src/lib/api.ts`** — Primary Axios instance with request/response interceptors (attaches Bearer token, `x-branch-id` header, handles 401 token refresh)
- **`src/axios/client.ts`** — Legacy Axios client (prefer `src/lib/api.ts` for new code)

React Query config (in `src/context/tanstack-context.tsx`): `staleTime: 25s`, retry up to 3 times (skips retrying 404s), `refetchOnWindowFocus: false`.

### State Management

- **Server state**: React Query
- **Client state**: Zustand stores in `src/store/` — `auth-store.ts` (user profile, persisted to localStorage), `header-store.ts`, `sidebar-store.ts`

### Component Organization (Atomic Design)

- `components/atoms/` — Primitive UI elements (Button, Heading, DatePicker, etc.)
- `components/molecules/` — Composed atoms
- `components/organisms/` — Complex feature components
- `components/templates/` — Page-level layouts
- `components/ui/` — shadcn/ui components (Radix UI-based, New York style)

### Forms

React Hook Form + Zod. Schemas live in `src/schema/`. Use `@hookform/resolvers/zod` for integration.

### URL State

Use **nuqs** (`src/hooks/use-search-params.ts`) for type-safe URL search params — filters, pagination, and tab state are kept in the URL.

### Styling

Tailwind CSS 4 with CSS variables for theming. Custom colors, spacing, shadows, and grid templates are defined in `tailwind.config.ts`. Font: Inter (body), Figtree (headings).

**Typography & color tokens:** Use the typography scale and color tokens already defined in `src/app/globals.css` instead of arbitrary Tailwind values. Font-size/weight scale: `text-h1`–`text-h6` (headings), `text-b12`/`b13`/`b14`/`b16` with `-500`/`-600`/`-700` weight suffixes, `text-c1`/`c2` (captions). Color tokens: `text-neutral-black` (`#1c1c1c`), `text-neutral-light-grey` (`#757575`), `border-neutral-border-light` (`#ebebeb`), `text-utility-red`/`text-utility-green`, etc. Do not write `text-[13px]`, `leading-[18px]`, or one-off hex colors when a token already covers the size/weight/color you need — check `globals.css` first. It's fine to layer a `font-*` weight override on top of a size token when no exact combined token exists (e.g. `text-h4 font-semibold`). Only fall back to a raw arbitrary value when no reasonably close token exists.

### Environment

```
NEXT_PUBLIC_BACKEND_URL=<api base url>
```

The Axios client reads this via `src/config/index.ts` (`EnvConfig` class).

## Context Usage

If the user mentions "use context7" or implies Context7 MCP usage, automatically apply the rules defined in `.claude/docs/context7.md` for selecting, ranking, and merging contexts; prioritize relevance over quantity and avoid conflicting or cross-version combinations.

### Date & Time

Use **Luxon** (`luxon`) for all new date/time work. Do not use `date-fns` for new tasks.


### UI Components

- `src/components/ui/` — base shadcn-style components (Radix UI primitives)
- `src/components/ui-next/` — newer/refactored replacements
- `src/components/common/` — app-wide shared components
- Styling: Tailwind CSS v4 + `tailwind-variants` for component variants; `cn` utility at `src/lib/cn.ts`

### Data Fetching

TanStack Query v5 throughout. Query key factories are co-located in each feature's `querykeys.ts`. Global `queryClient` is in `src/components/common/providers`.


### Role-Based Access Control

Two separate RBAC layers:

1. **Route-level** (`src/config/role-based-routes.ts`): `ROUTE_ACCESS` map of route → allowed roles, enforced via middleware/layout.
2. **Feature-level** (`src/config/role-based-features.ts`): `FEATURE_ACCESS` map of `SystemFeatureType` → allowed roles, used inside components to conditionally show actions.

User roles: `UserRoleType` (ChurchAdmin, WebsiteAdmin, InterestCoordinator, Mentor, BibleStudyLeader, etc.) and `SystemRoleType` (SuperAdmin, BsoAdmin, VOP, External). Role enums live in `src/constants/`.

## General Behavior Rules

- **Always ask before acting when context is unclear or more information is needed.** Never guess or dive in directly — ask clarifying questions first.
- **Before making decisions that could meaningfully affect the outcome** (e.g. architecture choices, ambiguous requirements, destructive operations), ask the user to confirm or clarify upfront.

## Behavioral Guidelines (Reduce Common Coding Mistakes)

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
