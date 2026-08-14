'use client';

import React from 'react';

import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import Input, { InputProps } from './input';

/** info: Search field used in list / table toolbars. Keeps the magnifier icon, the 36px height
 *  (matches the Date range filter and the Figma header) and the same border token as the
 *  outline buttons sitting next to it, so every toolbar looks the same across the app.
 */

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ LeftIcon, className, classNames, ...props }, ref) => (
    <Input
      ref={ref}
      LeftIcon={LeftIcon || Search}
      className={cn('max-w-[18rem]', className)}
      classNames={{
        ...classNames,
        container: cn('border-neutral-border/60', classNames?.container),
        input: cn('h-9', classNames?.input),
      }}
      {...props}
    />
  ),
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
