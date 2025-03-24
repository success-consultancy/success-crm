"use client";

import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { cn } from "@/lib/cn";
import { FixedSizeList } from "react-window";
import Input from "./input";
import { Search } from "lucide-react";

export interface ISelectOptions {
  label: string;
  value: string;
}

type Props = {
  options: ISelectOptions[];
  label: string;
  value?: string;
  onSelect?: (val: string) => void;
  placeholder?: string;
  error?: string;
};

const SelectWithCommand = ({
  options: initialOptions,
  label,
  value,
  onSelect,
  placeholder,
  error,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<ISelectOptions[]>(initialOptions);

  const inputRef = useRef<HTMLInputElement | null>(null); // Nullable ref

  // Reset filtered options when initialOptions change
  useEffect(() => {
    setFilteredOptions(initialOptions);
  }, [initialOptions]);

  // Update filtered options when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(initialOptions);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();

    let newOptions = initialOptions.filter((option) =>
      option.label.toLowerCase().includes(lowercaseSearch)
    );

    if (value) {
      const selectedOption = initialOptions.find(
        (option) => option.value === value
      );
      if (
        selectedOption &&
        !newOptions.some((option) => option.value === value)
      ) {
        newOptions = [selectedOption, ...newOptions];
      }
    }

    setFilteredOptions(newOptions);
  }, [searchTerm, initialOptions, value]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Restore focus when options update
  useEffect(() => {
    if (inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [filteredOptions]);

  // Reset search when select is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchTerm("");
    } else {
      setTimeout(() => {
        requestAnimationFrame(() => inputRef.current?.focus());
      }, 0); // Ensure input focus after dropdown opens
    }
  };

  return (
    <div className="flex flex-col gap-1 flex-1">
      <Label className="text-b3-b font-semibold">{label}</Label>

      <Select
        value={value}
        onValueChange={onSelect}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className={cn([error && "border-primary-red"])}>
          <SelectValue>
            {initialOptions.find((option) => option.value === value)?.label
              ? initialOptions.find((option) => option.value === value)?.label
              : `Select a ${label.toLowerCase()}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <Input
            ref={(el) => {
              inputRef.current = el;
            }} // Assign ref dynamically
            placeholder="Type to search..."
            onChange={handleSearch}
            value={searchTerm}
            LeftIcon={Search}
          />

          <FixedSizeList
            height={Math.max(35, Math.min(filteredOptions.length * 35, 200))}
            itemCount={filteredOptions.length}
            itemSize={35}
            width={"100%"}
            className="mt-1"
          >
            {({ index, style }) => {
              const option = filteredOptions[index];
              return (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  style={style}
                  className={
                    option.value === value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {option.label}
                </SelectItem>
              );
            }}
          </FixedSizeList>
        </SelectContent>
      </Select>
      {error && <span className="text-primary-red">{error}</span>}
    </div>
  );
};

export default SelectWithCommand;
