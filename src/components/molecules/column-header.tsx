'use client';

import { ArrowDown, ArrowDownAZ, ArrowDownZA, ArrowUp, ChevronDown, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useSearchParams from '@/hooks/use-search-params';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  title: string;
  keyParam: string;
  className?: string;
};

const ColumnHeader = (props: Props) => {
  const [sortingState, setSortingState] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const { searchParams, setParams } = useSearchParams();

  // Initialize sorting state from URL params
  useEffect(() => {
    const order = searchParams.get('order');
    const orderBy = searchParams.get('order_by');
    
    if (order && orderBy === props.keyParam) {
      setSortingState(order);
    }
  }, [searchParams, props.keyParam]);

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

  const handleSortChange = (order: 'asc' | 'desc' | 'none') => {
    if (order === 'none') {
      setSortingState(undefined);
      setParams([
        {
          name: 'order',
          value: null,
        },
        {
          name: 'order_by',
          value: null,
        },
        {
          name: 'page',
          value: null,
        },
      ]);
    } else {
      setSortingState(order);
    }
    setOpen(false);
  };

  const isActiveSortedHeader = props.keyParam === searchParams.get('order_by');
  const isSorted = (sortingState || searchParams.get('order')) && isActiveSortedHeader;

  if (!props.title) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn(['flex items-center cursor-pointer gap-1.5 select-none justify-between', props.className])}>
          <span className="font-medium">{props.title}</span>
          <div className="flex items-center">
            <ArrowUp
              className={cn([
                'h-4 w-4 mr-1',
                isSorted ? 'block' : 'hidden',
                sortingState === 'desc' && 'rotate-180',
              ])}
              strokeWidth={2}
            />
            <ChevronDown
              className={cn(['h-3.5 w-3.5 text-neutral-darkGrey transition-transform', open && 'rotate-180'])}
              strokeWidth={2}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleSortChange('asc')}
            className={cn([
              'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left',
              sortingState === 'asc' && 'bg-muted',
            ])}
          >
            <ArrowDownAZ className="h-4 w-4" />
            <span>Sort Ascending</span>
          </button>
          <button
            onClick={() => handleSortChange('desc')}
            className={cn([
              'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left',
              sortingState === 'desc' && 'bg-muted',
            ])}
          >
            <ArrowDownZA className="h-4 w-4" />
            <span>Sort Descending</span>
          </button>
          <button
            onClick={() => handleSortChange('none')}
            className={cn([
              'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left',
            ])}
          >
            <X className="h-4 w-4" />
            <span>Clear Sort</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnHeader;
