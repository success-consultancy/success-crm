# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server on port 3001
bun run build        # Production build
bun run lint         # ESLint check
bun run format       # Prettier format
```

No test runner is configured in this project.

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

### Environment

```
NEXT_PUBLIC_BACKEND_URL=<api base url>
```

The Axios client reads this via `src/config/index.ts` (`EnvConfig` class).
