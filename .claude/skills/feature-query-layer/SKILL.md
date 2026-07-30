---
name: feature-query-layer
description: Build scalable, maintainable TanStack Query v5 query keys, queries, and mutations for a feature following the project's established patterns. Use when the user invokes /feature-query-layer with a feature name, resource name, or a description of what API layer to build.
version: 1.1.0
---

# Feature Query Layer Skill

Generate the full TanStack Query layer for `$ARGUMENTS` — query key factories, query hooks, and mutation hooks — following the conventions established in this codebase.

**Never deviate from these patterns without explicit instruction.**

---

## Phase 1 — Gather Context & Resolve API Contract

### 1a. Read the feature directory

1. Identify the **feature directory**: `src/features/<feature-name>/`.
2. Read the feature's existing `<feature-name>.types.ts` to understand available filter/param/response types.
3. Read the feature's existing `<feature-name>.querykeys.ts` if it exists.
4. Check if cross-feature invalidations are required by reading related query key files.

### 1b. Resolve the API contract for each operation

For **every** query or mutation you are about to generate, you must know:

| Field                      | What to collect                                          |
| -------------------------- | -------------------------------------------------------- |
| **Endpoint**               | Full path e.g. `/bso/hq-list` or `/interest/:id/mentors` |
| **Method**                 | `GET` / `POST` / `PUT` / `PATCH` / `DELETE`              |
| **Query params / filters** | Shape of the URL search params (for GETs)                |
| **Request body / payload** | Shape sent in the request body (for mutations)           |
| **Response shape**         | Shape of `data.payload` returned by the server           |

**How to resolve — in priority order:**

1. **User provided explicit details** in `$ARGUMENTS` (endpoint string, method, JSON sample, TypeScript type, or prose description) → use them directly.
2. **User provided a JSON sample** for payload or response → derive TypeScript types from it following the type-generation rules in §1c below.
3. **Existing types file** (`<feature-name>.types.ts`) already has matching interfaces → import and reuse them.
4. **None of the above** → generate mock/placeholder types clearly marked with a `// TODO: replace with real types` comment, and note in your response which types need to be filled in.

### 1c. Deriving types from a JSON sample

When the user provides a JSON object, convert it to a TypeScript interface following these rules:

- Prefix interfaces with `I`, type aliases with `T`.
- Use `string`, `number`, `boolean`, `null`. Do **not** use `any`.
- Arrays become `Array<Item>` with a named item interface.
- Nested objects become their own named interface.
- Optional fields (value is `null` or absent in the sample) use `?`.
- Paginated responses always extend this base:

```ts
interface IPaginatedBase {
  page: number;
  has_next: boolean;
  total: number;
}
```

**Example — JSON in, types out:**

```jsonc
// input sample
{
  "id": "abc123",
  "name": "HQ West",
  "is_active": true,
  "created_at": "2024-01-01",
  "tags": [{ "id": 1, "label": "tag-a" }],
}
```

```ts
// generated types
interface IHqTag {
  id: number;
  label: string;
}

interface IHqItem {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  tags: Array<IHqTag>;
}
```

Place generated types in the feature's `<feature-name>.types.ts`, marked with `// TODO: verify against actual API response`.

### 1d. What to do when nothing is provided

If the user gives **only** a feature/resource name with no endpoint, method, payload, or response details:

1. Generate the full layer using **mock placeholder types** named after the resource.
2. Use a realistic-looking but obviously fake endpoint like `/feature/<resource-name>`.
3. Mark every placeholder with `// TODO: replace with real endpoint/types` comments.
4. List all TODOs at the end of your response in a "What still needs filling in" section.

Do **not** ask clarifying questions — generate immediately with placeholders.

---

## Phase 2 — Query Key Factory

**File:** `src/features/<feature-name>/<feature-name>.querykeys.ts`

### Rules

- Export a single `FEATURE_QUERY_KEYS` constant (named `<FEATURE>_QUERY_KEYS`).
- For sub-resources, export an additional named constant (e.g., `FEATURE_SUB_QUERY_KEYS`).
- Every key function uses `as const` spreads to preserve tuple types.
- `all` is the root anchor — **every** other key descends from it.
- `lists()` is the **master invalidation key** for all list variants — add a JSDoc comment explaining this.
- Nest keys hierarchically: `detail(id)` → `analytics(id)` builds on `detail`.

### Template

```ts
import { IFeatureFilters, IFeatureDetailParams } from '@/features/<feature-name>/<feature-name>.types';

const FEATURE_QUERY_KEYS = {
  all: ['<feature-name>'] as const,

  /* Master key for all list queries — invalidate this after any mutation that affects the list. */
  lists: () => [...FEATURE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: IFeatureFilters = {}) => [...FEATURE_QUERY_KEYS.lists(), filters] as const,
  infiniteList: (filters: IFeatureFilters = {}) => [...FEATURE_QUERY_KEYS.lists(), 'infinite', filters] as const,

  detail: (id: string) => [...FEATURE_QUERY_KEYS.all, 'detail', id] as const,

  // Sub-resource: builds on detail hierarchy
  subResource: (id: string) => [...FEATURE_QUERY_KEYS.detail(id), 'sub-resource'] as const,
};

export default FEATURE_QUERY_KEYS;
```

### Key Hierarchy Rules

| Key                     | Spread                              | When to invalidate                           |
| ----------------------- | ----------------------------------- | -------------------------------------------- |
| `all`                   | `['feature']`                       | Invalidates everything in the feature        |
| `lists()`               | `[...all, 'list']`                  | Invalidates all list + infinite list queries |
| `list(filters)`         | `[...lists(), filters]`             | Invalidates a specific filtered list         |
| `infiniteList(filters)` | `[...lists(), 'infinite', filters]` | Invalidates a specific infinite query        |
| `detail(id)`            | `[...all, 'detail', id]`            | Invalidates a single entity                  |
| `subResource(id)`       | `[...detail(id), 'sub-resource']`   | Invalidates a nested sub-resource            |

---

## Phase 3 — Query Hooks

**File naming:** `src/features/<feature-name>/api/get-<feature>-<resource>.ts`

### 3a. Standard `useQuery`

```ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { buildUrl } from '@/utils/url-builder';
import FEATURE_QUERY_KEYS from '@/features/<feature-name>/<feature-name>.querykeys';
import { IFeatureFilters, IFeatureResponse } from '@/features/<feature-name>/<feature-name>.types';

async function getFeatureList(filters?: IFeatureFilters): Promise<IFeatureResponse> {
  const endpoint = buildUrl({
    paths: ['<api-path>'],
    queryParams: filters,
  });
  const { data } = await api.get(endpoint);
  return data?.payload;
}

export const useGetFeatureList = (filters?: IFeatureFilters, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: FEATURE_QUERY_KEYS.list(filters),
    queryFn: () => getFeatureList(filters),
  });
};
```

**Rules:**

- The fetcher function is a plain `async` function (not inline in the hook).
- The fetcher is named `get<Resource>` (camelCase).
- The hook is named `useGet<Resource>`.
- Return `data?.payload` from the fetcher — never return the raw axios response.
- Pass `options` as a spread before the mandatory keys so callers can set `enabled`, `staleTime`, etc.

### 3b. `useInfiniteQuery`

```ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { buildUrl } from '@/utils/url-builder';
import FEATURE_QUERY_KEYS from '@/features/<feature-name>/<feature-name>.querykeys';
import { IFeaturePaginatedFilters, IFeaturePaginatedResponse } from '@/features/<feature-name>/<feature-name>.types';

async function getFeatureInfiniteList(
  filters: Omit<IFeaturePaginatedFilters, 'page'> & { page: number },
): Promise<IFeaturePaginatedResponse> {
  const endpoint = buildUrl({
    paths: ['<api-path>'],
    queryParams: filters,
  });
  const { data } = await api.get(endpoint);
  return data?.payload;
}

export const useGetInfiniteFeatureList = (filters: Omit<IFeaturePaginatedFilters, 'page'>) => {
  return useInfiniteQuery({
    queryKey: FEATURE_QUERY_KEYS.infiniteList(filters),
    queryFn: ({ pageParam }) => getFeatureInfiniteList({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (data) => (data.has_next ? data.page + 1 : undefined),
    getPreviousPageParam: (data) => (data.page > 1 ? data.page - 1 : undefined),
  });
};
```

**Rules:**

- Always set `initialPageParam: 1`.
- The hook signature omits `page` from filters — callers never pass `page` directly.
- `getNextPageParam` returns `undefined` when `has_next` is falsy (stops fetching).
- `getPreviousPageParam` returns `undefined` when already on page 1.

### 3c. On-Demand Fetch (Lazy GET via `useMutation`)

Use this when data must be fetched imperatively (e.g., print-on-demand, export preview):

```ts
export const useGetFeatureListFn = (params: IFeatureParams) => {
  return useMutation({
    mutationFn: () => getFeatureList(params),
  });
};
```

**Rules:**

- Suffix the hook name with `Fn` to signal it returns `mutate`/`mutateAsync`.
- No `onSuccess` toast — the caller handles the result.
- Only use this pattern when the fetch is truly imperative; prefer `useQuery` with `enabled` otherwise.

---

## Phase 4 — Mutation Hooks

**File naming:** `src/features/<feature-name>/api/<verb>-<feature>-<resource>.ts`

Valid verb prefixes: `create`, `update`, `delete`, `archive`, `toggle`, `export`, `assign`.

### Standard Mutation

```ts
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { buildUrl } from '@/utils/url-builder';
import { queryClient } from '@/components/common/providers';
import FEATURE_QUERY_KEYS from '@/features/<feature-name>/<feature-name>.querykeys';

type TCreateFeaturePayload = {
  name: string;
  // ...
};

async function createFeature(payload: TCreateFeaturePayload) {
  const endpoint = buildUrl({ paths: ['<api-path>'] });
  const { data } = await api.post(endpoint, payload);
  return data?.payload;
}

export const useCreateFeature = () => {
  return useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.lists() });
      toast.success('Feature created successfully.');
    },
  });
};
```

### Invalidation Decision Table

| Scenario                          | What to invalidate                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Create / update any entity        | `FEATURE_QUERY_KEYS.lists()` — refreshes all list views                                                          |
| Delete an entity                  | `FEATURE_QUERY_KEYS.lists()` + `resetQueries` on the specific `detail(id)` (with ~2 s delay if redirect follows) |
| Toggle status that affects counts | `FEATURE_QUERY_KEYS.lists()` + any sub-resource keys                                                             |
| Bulk action on related entities   | `FEATURE_QUERY_KEYS.all` (broadest sweep) + individual `detail(id)` per affected ID                              |
| Cross-feature side effect         | Also invalidate the affected feature's key (import their `QUERY_KEYS`)                                           |

### Cross-Feature Invalidation

When a mutation in Feature A changes data that Feature B displays, import Feature B's query keys and invalidate them in `onSuccess`:

```ts
import FEATURE_QUERY_KEYS from '@/features/<feature-name>/<feature-name>.querykeys';
import OTHER_FEATURE_QUERY_KEYS from '@/features/<other-feature>/<other-feature>.querykeys';

onSuccess: (_, payload) => {
  queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.lists() });
  queryClient.invalidateQueries({ queryKey: OTHER_FEATURE_QUERY_KEYS.lists() });
},
```

### Post-Delete `resetQueries` Pattern

When delete triggers a redirect to a list page, reset the detail cache after a short delay so stale data is not served if the user navigates back:

```ts
onSuccess: (_, payload) => {
  queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEYS.lists() });

  setTimeout(() => {
    queryClient.resetQueries({ queryKey: FEATURE_QUERY_KEYS.detail(payload.id) });
  }, 2000);

  toast.success('Item deleted successfully.');
},
```

### Export / File-Download Mutation

For mutations that return binary/CSV data (no query key involved):

```ts
export function useExportFeatureData() {
  return useMutation({
    mutationFn: async (payload: ExportPayload) => {
      const response = await api.post(`/<api-path>/export`, payload);
      return response.data; // raw blob, not .payload
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export-' + formatDateTime(new Date(), 'dd-MMM__h-m') + '.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exported successfully.');
    },
  });
}
```

---

## Phase 5 — Checklist Before Finishing

- [ ] API contract is resolved for every operation (endpoint, method, payload, response).
- [ ] Types derived from JSON samples are placed in `<feature-name>.types.ts` with `// TODO: verify` comments.
- [ ] All placeholder types are marked `// TODO: replace with real types` and listed in the "What still needs filling in" section.
- [ ] Query key factory uses `as const` on every key.
- [ ] `lists()` has a JSDoc comment marking it as the master invalidation key.
- [ ] All query hooks source their `queryKey` from the factory — no inline string arrays.
- [ ] All fetcher functions are separate named `async` functions, not inline arrow fns.
- [ ] `useInfiniteQuery` hooks have `initialPageParam: 1`.
- [ ] All mutations import `queryClient` from `@/components/common/providers`.
- [ ] All mutations show a `toast.success` on `onSuccess` (except lazy-fetch `Fn` hooks).
- [ ] Cross-feature invalidations import and use the affected feature's own query keys.
- [ ] File names match the verb/noun convention: `get-*`, `create-*`, `update-*`, `delete-*`, `archive-*`, `toggle-*`, `export-*`.
- [ ] `buildUrl` is used for all parameterized URL construction.
- [ ] Response extraction uses `data?.payload` consistently.

---

## Appendix — "What still needs filling in" section format

When placeholder types or endpoints are used, end your response with this section:

```
## What still needs filling in

| File | Symbol | Needs |
|---|---|---|
| `src/features/foo/foo.types.ts` | `IFooItem` | Real response shape from backend |
| `src/features/foo/api/get-foo-list.ts` | endpoint | Confirm path `/foo/list` with backend |
| `src/features/foo/api/create-foo.ts` | `TCreateFooPayload` | Actual POST body fields |
```
