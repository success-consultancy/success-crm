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
import { FixedSizeList } from "react-window";

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
          <FixedSizeList
            height={200}
            itemCount={props.options.length}
            itemSize={35}
            width={"100%"}
          >
            {({ index, style }) => {
              const option = props.options[index];
              return (
                <SelectItem
                  value={option.value}
                  key={option.value}
                  style={style}
                >
                  {option.label}
                </SelectItem>
              );
            }}
          </FixedSizeList>
        </SelectContent>
      </Select>
      {props.error && <span className="text-primary-red">{props.error}</span>}
    </div>
  );
};

export default SelectCommon;

