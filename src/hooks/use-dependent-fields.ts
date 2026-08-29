'use client';

import { useEffect, useRef } from 'react';
import type { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import { isBlankValue, type DependentFieldRule } from '@/schema/dependent-fields';

/**
 * Empties dependent fields as soon as their parent is cleared, so a visa expiry
 * date can't survive the visa it belongs to being removed. The inputs are
 * disabled separately (`isBlankValue(watch(parent))`); this covers the moment
 * the parent goes blank while the dependent already holds a value.
 *
 * Takes the same rules the schema validates against, so the two can't drift.
 */
export function useDependentFields<T extends FieldValues>(form: UseFormReturn<T>, rules: DependentFieldRule[]) {
  const { watch, getValues, setValue } = form;

  // Rules are module-level constants, so keep them off the dependency list.
  const rulesRef = useRef(rules);
  rulesRef.current = rules;

  useEffect(() => {
    const subscription = watch((_values, { name }) => {
      const rule = rulesRef.current.find((candidate) => candidate.parent === name);
      if (!rule || !isBlankValue(getValues(rule.parent as Path<T>))) return;

      for (const dependent of rule.dependents) {
        const path = dependent as Path<T>;
        if (isBlankValue(getValues(path))) continue;

        setValue(path, null as PathValue<T, Path<T>>, { shouldDirty: true, shouldValidate: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues, setValue]);
}
