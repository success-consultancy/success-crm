/**
 * Date-of-birth is persisted as a formatted string ('yyyy-MM-dd' in the service
 * modules, 'MM/dd/yyyy' in leads). Both parse with `new Date`, so this guard is
 * shared by every schema that carries a `dob` field.
 */
export const DOB_FUTURE_MESSAGE = 'Date of birth cannot be in the future';

export const isNotFutureDate = (value: string | null | undefined): boolean => {
  if (!value) return true;

  const date = new Date(value);
  // Unparseable input is reported by the field's own format rules, not here.
  if (isNaN(date.getTime())) return true;

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return date <= endOfToday;
};
