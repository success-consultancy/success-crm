// regex for password validation with at least 1 uppercase, at least 1 lowercase, 1 number or symbol and minimum 10 characters
export const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9!@#$%^&*]).{10,}$');

export const passwordRequirements = [
  { label: 'An English uppercase character (A-Z)', regex: /^(?=.*[A-Z])/ },
  { label: 'An English lowercase character (a-z)', regex: /^(?=.*[a-z])/ },
  { label: 'A number (0-9) and/or symbol', regex: /[\d!@#$%^&*()]/ },
  { label: 'Ten or more characters', regex: /^.{10,}$/ },
];

// function to check if password meets the requirements and return boolean
export function validatePassword(password: string): boolean {
  return passwordRequirements.every((req) => req.regex.test(password));
}
