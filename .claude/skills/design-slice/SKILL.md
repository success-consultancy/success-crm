---
name: design-slice
description: Slice a design image or description into production-ready React components for this project. Faithfully reproduces the given design using Next.js, Tailwind CSS v4, shadcn/Radix UI, and project conventions. Use when the user provides a design mockup, screenshot, or visual description to convert into code.
version: 1.0.0
---

Slice the design provided in `$ARGUMENTS` into production-ready code for this Next.js codebase.

The argument is **required** and must be one of:

- A file path or URL to a design image (screenshot, mockup, Figma export, etc.)
- A textual description of the visual design to implement

---

## Phase 1 — Analyse the Design

If the input is an **image**, read it carefully and extract:

- Layout structure (grid, flex, sections, columns, nesting hierarchy)
- Spacing and sizing (padding, margins, gaps, widths, heights — estimate in `rem` / Tailwind scale)
- Color palette (background, surface, text, border, accent colors — map to hex or CSS variables)
- Typography (font sizes, weights, line heights, letter spacing — map to Tailwind text utilities)
- Interactive states visible (hover, active, disabled, focus rings, loading)
- Component boundaries (which pieces are distinct, reusable units)
- Any icons, images, or illustrations and their approximate dimensions

If the input is a **description**, parse it for the same categories above, making reasonable visual decisions where values are not specified.

Before proceeding, briefly list what you found:

- Layout type
- Key components identified
- Color tokens
- Typography scale
- Any ambiguities that need a decision

If anything critical is ambiguous (e.g. unclear interaction behavior, missing a color), make a reasonable design decision and state it explicitly — do not block on minor unknowns.

---

## Phase 2 — Plan the Slice

Map the design to code units:

1. **Component tree** — identify the top-level component and all sub-components
2. **Which components are reusable** → go in `src/components/ui/`; feature-specific ones → go in `src/features/<feature>/components/`
3. **State & interactions** — list any stateful behavior (open/close, hover effects, form inputs, loading states)
4. **Data props** — define the TypeScript props API based on what varies in the design
5. **Variants** — if the design shows size/style variations, plan `tv()` variants

Share this plan and wait for approval before writing code.

---

## Phase 3 — Implement

### Stack constraints (strictly follow these)

- **Framework**: Next.js App Router — add `'use client'` only if the component has state or event handlers
- **Styling**: Tailwind CSS v4 — use utility classes; use `cn` from `@/lib/cn` for conditional classes
- **Variants**: `tv` from `@/lib/tailwind-variants`, typed with `VariantProps` from the same path
- **Primitives**: Prefer base UI primitives for interactive elements (dialogs, dropdowns, toggles, tooltips, etc.)
- **Icons**: Use icons from the project's existing icon library (check existing usage in `src/components/` before importing new packages)
- **No inline styles** — all styling via Tailwind classes or CSS variables; never `style={{}}`
- **No hardcoded colors** — use Tailwind color tokens or existing CSS variables from the project theme

### Design fidelity rules (adapted from frontend-design skill)

- **Pixel-accurate layout**: Reproduce spacing, alignment, and proportions faithfully. Prefer exact Tailwind scale values (`p-4`, `gap-6`) over approximations.
- **Color fidelity**: Match colors from the design. If the project uses a design token system (CSS variables), map design colors to the closest existing token; only introduce new variables if truly necessary.
- **Typography fidelity**: Match font sizes, weights, and line heights. Use the project's existing Tailwind typography scale — do not import new fonts unless the design explicitly requires one not in the project.
- **Motion**: Add only transitions/animations that are visible in the design or clearly implied by the interaction (e.g. dropdown open/close). Keep motion subtle and purposeful — `transition-colors`, `transition-transform`, `duration-150/200`.
- **Responsive**: If the design shows one breakpoint, make the component sensibly responsive unless told otherwise. Use `sm:`, `md:`, `lg:` prefixes.
- **Accessibility**: Add `aria-*` attributes, keyboard navigation, and focus-visible rings. Slicing a design does not mean ignoring a11y.

### Code conventions

- Export the component and all its public types by name
- Add the component export to `src/components/ui/index.ts` if it is a reusable UI primitive
- Extract non-trivial stateful logic into a co-located `use<ComponentName>.ts` hook
- Keep component files focused — no raw `fetch`, `axios`, or business logic

---

## Phase 4 — Report

After all files are written, output:

- **Files created** with their paths
- **Usage snippet** — copy-pasteable import + JSX with required props
- **Design decisions made** — any assumptions, color mappings, or interaction choices
- **Deviations from the design** — if any aspect couldn't be reproduced exactly, explain why and what was done instead
