---
name: date-time-formatter
description: Reference knowledge for the project's date/time formatting hooks. Covers the three hooks (useFormatDateTime, useDateTimeFormatter, useRelativeTime), the FORMATS constants, old-to-new pattern mapping, and migration examples. Load this skill whenever touching date/time display code.
version: 1.0.0
---

# Date/Time Formatting — Project Reference

All date/time **display** formatting must use the hooks in `@/hooks/use-date-time-formatter`.
These hooks are locale-aware (they read the active i18n locale from the i18next instance) and
timezone-aware (IANA timezone, currently defaulting to `undefined` until a global store is wired up).

Do NOT use `date-fns` `format`, `safeFormat`, `formatRelativeOrDate`, or bare Luxon calls for
anything shown to the user.

---

## The Three Hooks

```ts
import {
  useFormatDateTime, // format a single date value inline
  useDateTimeFormatter, // get a stable formatter function (for callbacks/column defs/memos)
  useRelativeTime, // "2 hours ago" with absolute fallback
} from '@/hooks/use-date-time-formatter';
import { FORMATS } from '@/utils/date-and-time/format-date-and-time'; // pre-defined Luxon format strings
```

### `useFormatDateTime(date, format?, options?)`

Formats a single date and returns the string directly. Safe to call in JSX render.
Internally calls `formatDateTime` (no React hook dependencies — does not need to be at
the top of the component, but keep it there for clarity).

```tsx
// In JSX render
<span>{useFormatDateTime(row.created_at, FORMATS.SHORT_DATE)}</span>
<span>{useFormatDateTime(date, 'EEEE, MMM d, yyyy')}</span>  // raw Luxon token
```

### `useDateTimeFormatter(overrides?)`

Returns a **stable `fmt` function** memoised with `useCallback`. Use this inside callbacks,
TanStack Table column defs, `useMemo`, or any place where calling a hook directly is not
allowed.

**This IS a real hook** — call it at the top of the component, not inside a callback.

```tsx
const fmt = useDateTimeFormatter();

// then use inside a column def or callback:
cell: ({ row }) => fmt(row.original.created_at, FORMATS.SHORT_DATE);
```

### `useRelativeTime(date, options?)`

Returns a localized relative string ("2 hours ago", "in 3 days") when the date is within the
configured window, otherwise falls back to a formatted absolute date. Returns `null` for
invalid dates.

```tsx
const timeAgo = useRelativeTime(activity.created_at, {
  fallbackFormat: FORMATS.SHORT_DATE, // used outside the relative window
  relativePastDays: 1, // default: show relative up to 1 day in the past
  relativeFutureDays: 1, // default: show relative up to 1 day in the future
});

<span>{timeAgo}</span>;
```

Widen the window to show relative time for longer periods:

```tsx
const timeAgo = useRelativeTime(date, { relativePastDays: 7, fallbackFormat: FORMATS.SHORT_DATE });
```

---

## `FORMATS` Constants

Defined in `src/utils/date-and-time/format-date-and-time.ts`. Import directly from there — **not** from the hook file.
All values are **Luxon** format strings.

| Constant                  | Format string             | Example output              |
| ------------------------- | ------------------------- | --------------------------- |
| `FORMATS.SHORT_DATE`      | `'MMM d, yyyy'`           | Aug 6, 2024                 |
| `FORMATS.SHORT_DATE_TIME` | `'MMM d, yyyy \| h:mm a'` | Aug 6, 2024 \| 1:07 PM      |
| `FORMATS.TIME_12_HOUR`    | `'h:mm a'`                | 1:07 PM                     |
| `FORMATS.TIME_24_HOUR`    | `'H:mm'`                  | 13:07                       |
| `'fff'` (raw Luxon)       | built-in preset           | August 6, 2024, 1:07 PM EDT |

For anything not in the table, use a raw Luxon format string.
See `src/utils/date-and-time/format-date-and-time.ts` for the full token reference.

---

## Old-Pattern → New-Hook Mapping

### `DATE_FORMATS` constants (`@/config`)

| Old constant                           | Value (date-fns)                | New                             | Notes                                     |
| -------------------------------------- | ------------------------------- | ------------------------------- | ----------------------------------------- |
| `DATE_FORMATS.FULL_DATE`               | `'MMM d, yyyy'`                 | `FORMATS.SHORT_DATE`            | Direct swap — identical string            |
| `DATE_FORMATS.TIME_12_HOUR`            | `'h:mm a'`                      | `FORMATS.TIME_12_HOUR`          | Direct swap — identical string            |
| `DATE_FORMATS.FULL_DATE_TIME`          | `'MMM d, yyyy \| h:mm a'`       | `FORMATS.SHORT_DATE_TIME`       | Direct swap — identical string            |
| `DATE_FORMATS.SHORT_DATE`              | `'MM/dd'`                       | `'MM/dd'` (raw string)          | No FORMATS equivalent; keep as raw string |
| `DATE_FORMATS.FULL_DATE_WITH_DAY`      | `'eeee, MMM d, yyyy'`           | `'EEEE, MMM d, yyyy'`           | `eeee` (date-fns) → `EEEE` (Luxon)        |
| `DATE_FORMATS.FULL_DATE_TIME_WITH_DAY` | `'eeee, MMM d, yyyy \| h:mm a'` | `'EEEE, MMM d, yyyy \| h:mm a'` | Token swap only                           |

### Old utility functions

| Old call                                  | Import                         | Replace with                                                               |
| ----------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `safeFormat(date, fmtStr)`                | `@/utils/date/safe-format`     | `useFormatDateTime(date, fmtStr)` in JSX; `fmt(date, fmtStr)` in callbacks |
| `formatRelativeOrDate(date)`              | `@/utils/date/formatSmartDate` | `useRelativeTime(date, { fallbackFormat: FORMATS.SHORT_DATE })`            |
| `formatRelativeOrDate(date, fallbackFmt)` | same                           | `useRelativeTime(date, { fallbackFormat: fallbackFmt })`                   |
| `format(date, fmtStr)` from `date-fns`    | `date-fns`                     | `useFormatDateTime(date, fmtStr)` — **only when used for display**         |

### Choosing between `useFormatDateTime` and `useDateTimeFormatter`

| Context                                | Use                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------- |
| JSX render — `<span>{...}</span>`      | `useFormatDateTime(date, FORMATS.X)`                                      |
| TanStack Table `cell:` / `accessorFn:` | `const fmt = useDateTimeFormatter()` at top, `fmt(date, ...)` in the cell |
| `useMemo` / `useCallback` body         | `const fmt = useDateTimeFormatter()` at top, `fmt(date, ...)` inside      |
| Event handler / `onSuccess` callback   | `const fmt = useDateTimeFormatter()` at top, `fmt(date, ...)` inside      |

---

## Migration Examples

```tsx
// ❌ safeFormat in JSX
import safeFormat from '@/utils/date/safe-format';
import { DATE_FORMATS } from '@/config';
<span>{safeFormat(date, DATE_FORMATS.FULL_DATE)}</span>;

// ✅
import { useFormatDateTime } from '@/hooks/use-date-time-formatter';
import { FORMATS } from '@/utils/date-and-time/format-date-and-time';
<span>{useFormatDateTime(date, FORMATS.SHORT_DATE)}</span>;

// ❌ date-fns format in JSX
import { format } from 'date-fns';
<span>{format(row.created_at, 'MMM d, yyyy')}</span>;

// ✅
import { useFormatDateTime } from '@/hooks/use-date-time-formatter';
import { FORMATS } from '@/utils/date-and-time/format-date-and-time';
<span>{useFormatDateTime(row.created_at, FORMATS.SHORT_DATE)}</span>;

// ❌ formatRelativeOrDate in JSX
import { formatRelativeOrDate } from '@/utils/date/formatSmartDate';
<span>{formatRelativeOrDate(activity.created_at)}</span>;

// ✅
import { useRelativeTime } from '@/hooks/use-date-time-formatter';
import { FORMATS } from '@/utils/date-and-time/format-date-and-time';
const timeAgo = useRelativeTime(activity.created_at, { fallbackFormat: FORMATS.SHORT_DATE });
<span>{timeAgo}</span>;

// ❌ date formatting inside a column def callback
import { formatRelativeOrDate } from '@/utils/date/formatSmartDate';
cell: ({ row }) => formatRelativeOrDate(row.original.created_at);

// ✅ useDateTimeFormatter — stable function, safe in callbacks
import { useDateTimeFormatter } from '@/hooks/use-date-time-formatter';
import { FORMATS } from '@/utils/date-and-time/format-date-and-time';
const fmt = useDateTimeFormatter();
// ...
cell: ({ row }) => fmt(row.original.created_at, FORMATS.SHORT_DATE);

// ❌ safeFormat inside a useMemo
const formatted = useMemo(() => safeFormat(date, DATE_FORMATS.FULL_DATE_TIME), [date]);

// ✅
import { useDateTimeFormatter } from '@/hooks/use-date-time-formatter';
import { FORMATS } from '@/utils/date-and-time/format-date-and-time';
const fmt = useDateTimeFormatter();
const formatted = useMemo(() => fmt(date, FORMATS.SHORT_DATE_TIME), [date, fmt]);
```

---

## What NOT to Migrate

- `format(date, 'yyyy-MM-dd')` and similar calls that produce **API or form values** — these are not display strings and must remain as-is (date-fns or raw Luxon strings are fine for machine output).
- Date calculations (`addDays`, `differenceInDays`, etc.) — only formatting calls need to change.
