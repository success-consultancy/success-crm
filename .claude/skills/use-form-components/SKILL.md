---
name: use-form-components
description: Create or update forms using the project's form component system at src/components/ui-next/form.tsx. Covers FormField/FormItem/FormLabel/FormControl/FormMessage pattern with react-hook-form + zod, all supported input types (Input, Textarea, Select, RadioGroup), field arrays, and dialog-hosted forms. Use when building any form in this codebase.
version: 1.0.0
---

# Form Components Skill

Build or update a form for `$ARGUMENTS` using the project's form primitives.

**Source of truth:** `src/components/ui-next/form.tsx`  
**Reference implementations:**

- Simple form in a dialog: `src/features/i18n-registry/components/breadcrumb-form-dialog.tsx`
- Full-page form with field array: `src/features/i18n-registry/components/enum-form.tsx`

---

## Phase 1 — Understand the request

Clarify before writing any code:

1. What fields does the form need?
2. Is it inside a Dialog or a full page?
3. Does it handle create, edit, or both (same form, different mutation)?
4. Are there repeating rows (field array)?

If any of these is unclear from context, ask.

---

## Phase 2 — Read the component API

Read `src/components/ui-next/form.tsx` before writing any form. Key facts:

- `Form` = `FormProvider` from react-hook-form. Wrap the entire form in it and spread `{...form}`.
- `FormField` uses `Controller` internally. Always pass `control` and `name`.
- `FormControl` uses `useRender` from `@base-ui/react/use-render`. Its `children` prop must be a **single renderable element** — never a fragment or plain string. Spread `{...field}` directly onto the input inside it.
- `FormLabel` accepts `required` and `optional` boolean props (renders `*` or `(Optional)` suffix).
- `FormMessage` reads the field's error automatically — do not pass children for validation messages.

---

## Phase 3 — Scaffold the schema and types

```ts
// 1. Define the zod schema
const mySchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
  optionalField: z.string().optional(),
});

// 2. Derive the TypeScript type from it
type MyFormValues = z.infer<typeof mySchema>;
```

Always use `zodResolver(mySchema)` in `useForm`. Never write manual `register` calls — use `Controller` via `FormField`.

---

## Phase 4 — Standard field pattern

Every field follows this exact structure. Do not deviate:

```tsx
<FormField
  control={control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel required>Label Text</FormLabel>
      <FormControl>
        <Input placeholder="…" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Rules:

- Always spread `{...field}` onto the input so react-hook-form controls value/onChange/onBlur/ref.
- `FormItem` provides the `id` context that links label → input via `htmlFor`.
- `FormMessage` must always be the last child of `FormItem`.
- Add `FormDescription` only when genuinely needed (not for restatements of the label).

---

## Phase 5 — Input type variants

### Text input

```tsx
<FormControl>
  <Input placeholder="e.g. user_status" disabled={isPending} {...field} />
</FormControl>
```

### Textarea

```tsx
<FormControl>
  <Textarea placeholder="What is this used for?" rows={2} disabled={isPending} {...field} />
</FormControl>
```

### Select (shadcn/ui, from `@/components/ui`)

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

<FormField
  control={control}
  name="platform"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel required>Platform</FormLabel>
      <FormControl>
        <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
          <SelectTrigger aria-invalid={!!fieldState.error}>
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

Note: Select is **not** a spread-`{...field}` component — use `value`/`onValueChange` explicitly. Pass `fieldState.error` to `aria-invalid` on the trigger.

### RadioGroup (for single selection from a small set)

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui-next/radio-group';

<FormField
  control={control}
  name="platform_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel required>Platform</FormLabel>
      <FormControl>
        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-x-5 gap-y-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2">
              <RadioGroupItem value={opt.value} disabled={isPending} />
              <span className="text-content-body text-sm">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

Use RadioGroup (not checkboxes) when only one value is valid. RadioGroup is backed by `@base-ui/react/radio-group`.

---

## Phase 6 — Field arrays (repeating rows)

For repeating rows (e.g. enum values, address lines):

```tsx
import { useFieldArray } from 'react-hook-form';

const { fields, append, remove } = useFieldArray({ control, name: 'values' });

// Column headers — only render on the first row to avoid repetition
{
  fields.map((field, index) => (
    <div key={field.id} className="flex gap-2">
      <FormField
        control={control}
        name={`values.${index}.value`}
        render={({ field }) => (
          <FormItem className="flex-1">
            {index === 0 && <FormLabel required>Value</FormLabel>}
            <FormControl>
              <Input placeholder="e.g. active" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        variant="destructive_hover"
        size="icon_md"
        onClick={() => remove(index)}
        className={cn(fields.length === 1 && 'hidden', 'mt-1 opacity-60')}
        endIcon={X}
      />
    </div>
  ));
}

<button onClick={() => append({ value: '', default_label: '' })}>
  <Icons.PlusIcon className="size-4" />
  Add Entry
</button>;
```

Rules:

- Always use `field.id` (not `index`) as the `key` on the row div.
- Only render `FormLabel` on `index === 0` when rows share the same columns, to avoid redundant labels.
- The remove button should be hidden (`hidden`) when there is only one row, not disabled.
- The append button is a plain `<button>`, not a `<Button>` component, with dashed border styling.

---

## Phase 7 — useForm setup

```tsx
const form = useForm<MyFormValues>({
  resolver: zodResolver(mySchema),
  defaultValues: {
    fieldName: '',
    optionalField: '',
  },
});

const { control, handleSubmit } = form;
```

For edit forms that load data asynchronously, reset after data arrives:

```tsx
useEffect(() => {
  if (data) {
    form.reset({
      fieldName: data.fieldName,
      optionalField: data.optionalField ?? '',
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]);
```

The eslint-disable is intentional — `form` reference is stable; only `data` should trigger the reset.

---

## Phase 8 — Submit handler

```tsx
function onValid(values: MyFormValues) {
  const payload = {
    fieldName: values.fieldName.trim(),
    optionalField: values.optionalField?.trim() || undefined,
  };

  if (isEdit) {
    updateMutation.mutate({ id, ...payload }, { onSuccess: () => router.push(ROUTES.SOME_ROUTE) });
  } else {
    createMutation.mutate(payload, { onSuccess: () => router.push(ROUTES.SOME_ROUTE) });
  }
}

// Wire to the save button:
<Button onClick={handleSubmit(onValid)} disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Save'}
</Button>;
```

When the form is a `<form>` element (dialog forms), use `type="submit"` on the button and `<form onSubmit={handleSubmit(onValid)}>` instead of `onClick`.

---

## Phase 9 — Dialog-hosted form pattern

When the form lives inside a Dialog, split into two components: an inner form component and an outer dialog wrapper. This avoids remounting issues and keeps the form state tied to the dialog open state.

```tsx
// Inner form
function MyForm({ initial, onSubmit, onCancel, isPending }: FormProps) {
  const form = useForm<MyFormValues>({ ... });
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col">
        <div className="flex flex-col gap-4 px-6 py-5">
          {/* fields */}
        </div>
        <DialogFooter className="border-stroke-divider border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Outer dialog wrapper
export function MyFormDialog({ open, onOpenChange, initial, onSubmit, isPending }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-stroke-divider border-b px-6 py-4">
          <DialogTitle>{initial ? 'Edit Item' : 'Add Item'}</DialogTitle>
        </DialogHeader>
        {open && (
          <MyForm
            initial={initial}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
```

The `{open && <MyForm />}` guard ensures the form fully unmounts and resets when the dialog closes.

---

## Phase 10 — Checklist before finishing

- [ ] `Form` wraps everything with `{...form}` spread
- [ ] Every `FormField` has `control` and `name`
- [ ] `FormControl` wraps exactly one element (no fragments)
- [ ] `{...field}` is spread on every standard input (except Select and RadioGroup which use `value`/`onValueChange`)
- [ ] `FormMessage` is the last child of every `FormItem`
- [ ] `FormLabel` uses `required` or `optional` prop (not text suffixes)
- [ ] Field array rows use `field.id` as key, `FormLabel` only on `index === 0`
- [ ] `useEffect` reset has the eslint-disable comment
- [ ] Dialog forms use the split inner/outer pattern with `{open && <InnerForm />}`
- [ ] Run `yarn check-types` and confirm zero errors before reporting done
