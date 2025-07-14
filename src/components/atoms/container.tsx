import * as React from 'react';

import { cn } from '@/lib/utils';

interface IContainerProps extends React.ComponentPropsWithRef<'div'> {
  gridLayout?: true;
  fluid?: true;
}

const Container: React.FC<IContainerProps> = React.forwardRef(({ className, fluid, gridLayout, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn([
        !fluid && ['mx-auto w-full', 'px-4 md:px-6 lg:px-10', 'max-w-[1800px] 4xl:max-w-[1800px] '],
        gridLayout && 'grid grid-cols-12 gap-x-lg-gutter',
        className,
      ])}
      {...props}
    />
  );
});

Container.displayName = 'Container';

export default Container;
