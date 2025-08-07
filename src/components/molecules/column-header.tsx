'use client';

import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import useSearchParams from '@/hooks/use-search-params';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  keyParam: string;
  className?: string;
};

const ColumnHeader = (props: Props) => {
  const [sortingState, setSortingState] = useState<string | undefined>();
  const [hovered, setHovered] = useState(false);
  const { searchParams, setParams } = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('order')) {
      setSortingState(undefined);
    }
    if (sortingState) {
      setParams([
        {
          name: 'order',
          value: sortingState,
        },
        {
          name: 'order_by',
          value: props.keyParam,
        },
        {
          name: 'page',
          value: null,
        },
      ]);
    }
  }, [sortingState, searchParams]);

  const handleArrowClick = () => {
    if (sortingState) {
      if (sortingState === 'asc') {
        setSortingState('desc');
      } else {
        setSortingState('asc');
      }
    } else {
      setSortingState('asc');
    }
  };

  return (
    <div
      className={cn(['flex items-center cursor-pointer gap-1 ', props.className])}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => handleArrowClick()}
    >
      <div className="relative">
        {props.title}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute -right-5  bottom-[50%] translate-y-[40%]">
              {(hovered || !!sortingState) && (
                <ArrowUp className={cn(['h-4 w-4', sortingState === 'desc' && 'rotate-180'])} strokeWidth={2} />
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={20} className="text-b2-b bg-white-100">
              <span>
                Sort {sortingState === 'asc' ? 'descending' : 'ascending'} by {props.title}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ColumnHeader;
