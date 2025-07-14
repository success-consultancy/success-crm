import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

interface ITooltipProps extends TooltipPrimitive.TooltipContentProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;

  classNames?: {
    arrow?: string;
    content?: string;
  };
}

const Tooltip: React.FC<ITooltipProps> = ({ trigger, children, classNames, ...contentProps }) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={150}>
        <TooltipPrimitive.TooltipTrigger asChild>{trigger}</TooltipPrimitive.TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={cn(['text-b1 text-white-100  bg-bg-dark px-4 py-3 rounded-lg z-[1000000]', classNames?.content])}
            {...contentProps}
          >
            <TooltipPrimitive.TooltipArrow className={cn(['fill-bg-dark', classNames?.arrow])} />
            {children}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
