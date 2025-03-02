import { Label } from "@radix-ui/react-label";
import React from "react";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectContent } from "@radix-ui/react-select";

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
};

const SelectCommon = (props: Props) => {
  return (
    <div className=" flex flex-col gap-1 flex-1">
      <Label className="text-b3-b font-semibold">{props.label}</Label>

      <Select value={props.value} onValueChange={props.onSelect}>
        <SelectTrigger className="">
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
    </div>
  );
};

export default SelectCommon;

