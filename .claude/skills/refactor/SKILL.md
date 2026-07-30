---
name: refactor
description: Refactor a file or block of code for clarity, maintainability, performance, and scalability. Use when the user invokes /refactor with a file path or function/hook name.
version: 1.0.0
disable-model-invocation: true
---

# Refactor Skill

Refactor the target code at `$ARGUMENTS` following the phases below.
**Never change existing behavior, public APIs, or function signatures unless explicitly asked.**

---

## Phase 1 — Read & Understand

1. Read the full target file or locate the named function/hook within it.
2. Understand what it does end-to-end before touching anything.
3. Note all exported symbols, props, and hook return values — these are the public API and must remain unchanged.

---

## Phase 2 — Identify Issues

Scan for the following and note each finding before making any change:

**Extraction candidates**

- Functions or hooks longer than ~4 0 lines doing more than one thing
- Repeated logic that appears 2+ times (inline or across nearby components)
- Inline derived values or expressions that have no name
- Large JSX blocks that can be split into sub-components

**Readability issues**

- Nested ternaries (replace with early returns or named variables)
- Deeply nested conditionals (flatten with guard clauses)
- Cryptic variable names
- Magic numbers or inline string literals that should be constants

**Performance concerns**

- Expensive computations inside render with no `useMemo`
- Callbacks recreated on every render passed as props (missing `useCallback`)
- Unnecessary `useEffect` that can be replaced with derived state
- State that could be consolidated

**Maintainability / scalability**

- Logic that belongs in a custom hook mixed into a component
- Feature-specific utilities sitting inside a view file (move to `utils/` or `hooks/`)
- Types defined inline that should live in the feature's `.types.ts`

---

## Phase 3 — Refactor

Apply the changes identified above in this order:

1. **Extract hooks** — move stateful logic out of components into named hooks in the feature's `hooks/` directory.
2. **Extract utilities** — move pure functions into the feature's `utils/` directory.
3. **Extract sub-components** — only if the piece has a clear, stable interface; keep it in the same file unless it's reusable elsewhere.
4. **Simplify conditionals** — use early returns and named booleans over nested ternaries.
5. **Memoize where justified** — add `useMemo`/`useCallback` only where the dependency array is stable and the cost is real; do not memoize everything.
6. **Name inline values** — extract magic values to well-named `const` at the top of the scope.

**Rules:**

- Do not rename exported symbols, props, or hook return values.
- Do not change component behavior, side effects, or data flow.
- Do not add features, new state, or new API calls.
- Do not add error handling that wasn't there before.
- Preserve all existing comments that carry intent; remove only comments that restate the obvious.

---

## Phase 4 — Comments

Add a comment **only** when:

- The logic is non-obvious and a future reader would likely misread it
- A workaround exists for a known bug or constraint (explain the why)
- A regex, algorithm, or formula needs a human explanation

Do **not** add comments that:

- Describe what the code does (the code already does that)
- Label sections like `// render` or `// handlers`
- Restate prop or variable names

---

## Phase 5 — Verify & Report

Before finishing:

1. Confirm every exported symbol, prop type, and hook return value is unchanged.
2. Confirm no new dependencies were introduced without reason.
3. Check that TypeScript types are consistent with the changes.

Then output a concise summary:

- What was extracted and where it lives now
- What was simplified and why
- Any memoization added and the justification
- Anything left unchanged intentionally (and why)
- Any follow-up suggestions (do not implement them — just note them)
