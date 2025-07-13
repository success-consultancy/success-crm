"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import { ArrowDown2 } from "iconsax-reactjs";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
  disabled?: boolean;
  emptyText?: string;
  error?: string;
  onBlur?: () => void;
  icon?: React.ReactNode;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  badgeClassName,
  emptyText = "No options found.",
  error,
  onBlur,
  disabled = false,
  icon = <ArrowDown2 className="size-5 shrink-0 opacity-50" />,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onBlur) {
      onBlur();
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-controls="popover-content"
            aria-expanded={open}
            aria-invalid={!!error}
            className={cn(
              "w-full justify-between border rounded-md border-gray-300 flex items-center px-3 cursor-pointer",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            onClick={() => !disabled && setOpen(!open)}
          >
            <div className="flex items-center mt-1 flex-wrap gap-1">
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selected.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Badge
                    key={value}
                    variant="secondary"
                    className={cn(
                      "mr-1 mb-1 gap-1 pr-0.5 pl-2",
                      badgeClassName,
                    )}
                  >
                    {option?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 rounded-full hover:bg-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) {
                          handleUnselect(value);
                        }
                      }}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {option?.label}</span>
                    </Button>
                  </Badge>
                );
              })}
            </div>
            {icon}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "flex items-center gap-2",
                        option.disabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
