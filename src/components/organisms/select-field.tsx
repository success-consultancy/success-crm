"use client";

import type React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown2 } from "iconsax-reactjs";
import { useController } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";

export type ObjType = {
  label: string;
  value: string;
};

interface SelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  options: ObjType[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const SelectField = <T extends FieldValues>({
  name,
  label,
  control,
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  icon = <ArrowDown2 className="size-5 shrink-0 opacity-50" />,
  className,
}: SelectFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? "This field is required" : false,
    },
  });

  return (
    <div className={`flex flex-col gap-2 w-full ${className || ""}`}>
      <Label htmlFor={name} className="font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        disabled={disabled}
        onValueChange={field.onChange}
        value={field.value || ""}
      >
        <SelectTrigger className="w-full" id={name}>
          <div className="flex items-center gap-2">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default SelectField;
