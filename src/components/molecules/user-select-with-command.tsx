'use client';

import { Label } from '@radix-ui/react-label';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select';
import { cn } from '@/lib/utils';
import { FixedSizeList } from 'react-window';
import Input from './input';
import { Search } from 'lucide-react';
import { useGetLeads, useGetLeadById } from '@/query/get-leads';
import useDebounceValue from '@/hooks/use-debounce';
import { useGetUserById, useGetUsers } from '@/query/get-user';
import { getAppointColorBasedOnUserName } from '@/utils/color';

export interface ISelectOptions {
  label: string;
  value: string;
}

type Props = {
  label?: string;
  value?: string;
  onSelect?: (val: string) => void;
  placeholder?: string;
  error?: string;
  className?: string
};

const UserSelectWithCommand = ({ label, value, onSelect, placeholder, error, className }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounceValue(searchTerm, 500);

  const { data: usersData, isLoading } = useGetUsers({
    q: debouncedSearch,
    limit: '50',
  });

  const { data: selectedUserData } = useGetUserById(value);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const options = useMemo(() => {
    if (!usersData) return [];
    return usersData.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id.toString(),
      email: user.email,
      phone: user.phone,
    }));
  }, [usersData]);

  const selectedLabel = useMemo(() => {
    if (selectedUserData) {
      return `${selectedUserData.firstName} ${selectedUserData.lastName}`;
    }
    return '';
  }, [selectedUserData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [options]);

  // Reset search when select is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchTerm('');
    } else {
      setTimeout(() => {
        requestAnimationFrame(() => inputRef.current?.focus());
      }, 0);
    }
  };

  return (
    <div className="flex flex-col gap-1 flex-1">
      {label && <Label className="text-b3-b font-semibold">{label}</Label>}

      <Select value={value} onValueChange={onSelect} onOpenChange={handleOpenChange}>
        <SelectTrigger className={cn(['w-full', error && 'border-primary-red', className])}>
          {selectedUserData?.firstName && (
            <div className={`w-2 ${getAppointColorBasedOnUserName(selectedUserData?.firstName || '', selectedUserData?.lastName || '', 'tailwind')} rounded-full flex-shrink-0 self-stretch`} />
          )}

          <SelectValue placeholder={placeholder}>{selectedLabel || placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent className="w-full">
          <Input
            ref={(el) => {
              inputRef.current = el;
            }}
            placeholder={placeholder}
            onChange={handleSearch}
            value={searchTerm}
            LeftIcon={Search}
          />

          <FixedSizeList
            height={Math.max(35, Math.min(options.length * 60, 250))}
            itemCount={options.length}
            itemSize={60}
            width={'100%'}
            className="mt-1"
          >
            {({ index, style }) => {
              const option = options[index];
              return (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  style={style}
                  className={cn(
                    'flex flex-col items-start py-2 h-[60px]',
                    option.value === value ? 'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-b2 text-foreground">{option.label}</span>
                    <span className="text-b4 text-muted-foreground truncate max-w-[200px]">
                      {option.email} | {option.phone}
                    </span>
                  </div>
                </SelectItem>
              );
            }}
          </FixedSizeList>
          {isLoading && options.length === 0 && (
            <div className="py-2 px-4 text-center text-muted-foreground text-b4">Searching...</div>
          )}
          {!isLoading && options.length === 0 && searchTerm && (
            <div className="py-2 px-4 text-center text-muted-foreground text-b4">No leads found</div>
          )}
        </SelectContent>
      </Select>
      {error && <span className="text-primary-red">{error}</span>}
    </div>
  );
};

export default UserSelectWithCommand;
