/**
 * Guards for date fields that record something that has already happened —
 * a birth, a document being issued, an application being lodged. These can
 * never legitimately sit in the future, unlike expiry / due / start dates.
 *
 * Values reach these helpers in whatever shape the owning schema stores:
 * a formatted string ('yyyy-MM-dd' in the service modules, 'MM/dd/yyyy' in
 * leads) or a `Date` in the schemas built on `z.date()`. Both parse with
 * `new Date`, so one guard covers every schema.
 */
export const DOB_FUTURE_MESSAGE = 'Date of birth cannot be in the future';

/** Message for any other past-only field, e.g. `futureDateMessage('Issue date')`. */
export const futureDateMessage = (label: string) => `${label} cannot be in the future`;

export const isNotFutureDate = (value: string | Date | null | undefined): boolean => {
  if (!value) return true;

  const date = new Date(value);
  // Unparseable input is reported by the field's own format rules, not here.
  if (isNaN(date.getTime())) return true;

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return date <= endOfToday;
};
