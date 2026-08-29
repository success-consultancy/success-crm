import { z } from 'zod';

/**
 * Fields that only mean something once another field is filled in — a visa
 * expiry with no visa attached, a passport issue date with no passport number,
 * a decision date for a status nobody set.
 *
 * The forms disable these inputs while the parent is blank, so this is the
 * backstop: it catches records that already carry an orphaned value and any
 * payload that reaches a resolver without going through the disabled input.
 */
export type DependentFieldRule = {
  /** Field that has to be filled in first. */
  parent: string;
  /** Fields that cannot hold a value while `parent` is blank. */
  dependents: string[];
  /** Error attached to every dependent that is filled in regardless. */
  message: string;
};

export const isBlankValue = (value: unknown): boolean =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

/**
 * Zod 4 drops refinements whenever a new object schema is derived from an
 * existing one, so this has to be re-applied after every `.pick()`, `.omit()`
 * and `.extend()` — including the section forms on the view pages.
 *
 * Rules whose parent is missing from the shape are skipped: a section that
 * edits a dependent without offering its parent can't be expected to fill it.
 */
export const withDependentFields = <T extends z.ZodRawShape>(schema: z.ZodObject<T>, rules: DependentFieldRule[]) => {
  const applicable = rules.filter((rule) => rule.parent in schema.shape);

  return schema.superRefine((data, ctx) => {
    const values = data as Record<string, unknown>;

    for (const rule of applicable) {
      if (!isBlankValue(values[rule.parent])) continue;

      for (const dependent of rule.dependents) {
        if (isBlankValue(values[dependent])) continue;

        ctx.addIssue({ code: 'custom', message: rule.message, path: [dependent] });
      }
    }
  });
};
