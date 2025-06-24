"use client";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { cn } from "@/lib/cn";
import { FixedSizeList } from "react-window";
import { Label } from "../ui/label";

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
  maxHeight?: number;
};

const SelectCommon = ({ maxHeight = 200, ...props }: Props) => {
  // Calculate the dynamic height based on the number of options
  const itemSize = 35; // Height of each item in pixels
  const calculatedHeight = props.options.length * itemSize;

  // Use the smaller of the calculated height or the maximum height
  const listHeight = Math.min(calculatedHeight, maxHeight);

  return (
    <div className="flex flex-col gap-1 flex-1">
      <Label className="text-b3-b font-semibold">{props.label}</Label>

      <Select value={props.value} onValueChange={props.onSelect}>
        <SelectTrigger className={cn([props.error && "border-primary-red"])}>
          <SelectValue
            placeholder={
              props.placeholder || `Select a ${props.label.toLowerCase()}`
            }
          />
        </SelectTrigger>
        <SelectContent>
          {props.options.length > 0 ? (
            <FixedSizeList
              height={listHeight}
              itemCount={props.options.length}
              itemSize={itemSize}
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
          ) : (
            <div className="py-2 px-2 text-sm text-muted-foreground">
              No options available
            </div>
          )}
        </SelectContent>
      </Select>
      {props.error && <span className="text-primary-red">{props.error}</span>}
    </div>
  );
};

export default SelectCommon;
