import { Label } from "@radix-ui/react-label";
import React from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { cn } from "@/lib/cn";

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

const SelectCommon = (props: Props) => {
  return (
    <div className=" flex flex-col gap-1 flex-1">
      <Label className="text-b3-b font-semibold">{props.label}</Label>

      <Select value={props.value} onValueChange={props.onSelect}>
        <SelectTrigger className={cn([props.error && "border-primary-red"])}>
          <SelectValue
            placeholder={
              props.placeholder || `Select a ${props.label.toLowerCase()}`
            }
            className=""
          />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option, idx) => (
            <SelectItem value={option.value} key={option.value + idx}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {props.error && <span className="text-primary-red">{props.error}</span>}
    </div>
  );
};

export default SelectCommon;

