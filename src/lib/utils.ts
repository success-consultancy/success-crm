import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The design tokens in globals.css register custom `text-*` sizes (--text-b3-b, --text-h4, ...).
// tailwind-merge only knows Tailwind's built-in scale, so it classifies these as text *colors* and
// drops them whenever a real colour class sits in the same cn() call -- e.g. cn('text-b14-600 text-neutral-black')
// silently resolved to just 'text-neutral-black', leaving the element at the inherited font size.
// Registering them as font sizes keeps both.
const CUSTOM_TEXT_SIZES = [
  'b1',
  'b1-b',
  'b2',
  'b2-b',
  'b3',
  'b3-b',
  'b12',
  'b12-500',
  'b12-600',
  'b12-700',
  'b13',
  'b13-500',
  'b13-600',
  'b13-700',
  'b14',
  'b14-500',
  'b14-600',
  'b14-700',
  'b16',
  'b16-500',
  'b16-600',
  'b16-700',
  'bu-l',
  'bu-m',
  'bu-s',
  'c1',
  'c1-b',
  'c1-c',
  'c2',
  'c2-b',
  'h1',
  'h2',
  'h3',
  'h4',
  'h4-700',
  'h5',
  'h6',
  's1',
  's3',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: CUSTOM_TEXT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
