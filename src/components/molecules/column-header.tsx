'use client';

import { ArrowDown, ArrowDownAZ, ArrowDownZA, ArrowUp, ChevronDown, Search, X } from 'lucide-react';
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
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const { searchParams, setParams } = useSearchParams();

  // Initialize sorting state from URL params
  useEffect(() => {
    const order = searchParams.get('order');
    const orderBy = searchParams.get('order_by');
    
    if (order && orderBy === props.keyParam) {
      setSortingState(order);
    }
    
    // Initialize search value from URL params
    const currentSearch = searchParams.get('q');
    const searchBy = searchParams.get('q_field');
    
    if (currentSearch && searchBy === props.keyParam) {
      setSearchValue(currentSearch);
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

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    setParams([
      {
        name: 'q',
        value: value,
      },
      {
        name: 'q_field',
        value: props.keyParam,
      },
      {
        name: 'page',
        value: null,
      },
    ]);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setParams([
      {
        name: 'q',
        value: null,
      },
      {
        name: 'q_field',
        value: null,
      },
      {
        name: 'page',
        value: null,
      },
    ]);
  };

  const isActiveSortedHeader = props.keyParam === searchParams.get('order_by');
  const isSorted = (sortingState || searchParams.get('order')) && isActiveSortedHeader;
  const hasActiveSearch = searchParams.get('q_field') === props.keyParam && searchParams.get('q');

  if (!props.title) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn(['flex items-center cursor-pointer gap-1.5 select-none justify-between', props.className])}>
          <span className="font-medium">{props.title}</span>
          <div className="flex items-center">
            {hasActiveSearch && (
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
            )}
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
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex flex-col gap-1">
          {/* Search Section */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${props.title.toLowerCase()}...`}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              {searchValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          
          {/* Sort Section */}
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sort by</p>
            <button
              onClick={() => handleSortChange('asc')}
              className={cn([
                'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full',
                sortingState === 'asc' && 'bg-muted',
              ])}
            >
              <ArrowDownAZ className="h-4 w-4" />
              <span>Sort Ascending</span>
            </button>
            <button
              onClick={() => handleSortChange('desc')}
              className={cn([
                'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full',
                sortingState === 'desc' && 'bg-muted',
              ])}
            >
              <ArrowDownZA className="h-4 w-4" />
              <span>Sort Descending</span>
            </button>
            <button
              onClick={() => handleSortChange('none')}
              className={cn([
                'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left w-full',
              ])}
            >
              <X className="h-4 w-4" />
              <span>Clear Sort</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnHeader;
