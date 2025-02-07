"use client";

import * as React from "react";
import { format } from "date-fns";
import { PopoverAnchor, PopoverArrow } from "@radix-ui/react-popover";

import { cn } from "@/lib/cn";
import Input from "@/components/common/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { CalendarProps, Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { DATE_FORMATS } from "@/app/config/date-formats";

type DatePickerProps = {
  disabledTooltip?: string | React.ReactNode;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  error?: string;
  errorBorder?: boolean;
  optionalText?: boolean;
  disablePicker?: boolean;
} & CalendarProps;

const DatePicker: React.FC<DatePickerProps> = ({
  disabledTooltip,
  error,
  label,
  placeholder,
  className,
  labelClassName,
  buttonClassName,
  errorBorder,
  optionalText,
  disablePicker,
  onDayClick,
  ...calenderProps
}) => {
  const [show, setShow] = React.useState(false);
  const FORMATTED_DATE = !!calenderProps.selected
    ? format(calenderProps.selected as Date, DATE_FORMATS.FULL_DATE_WITH_DAY)
    : undefined;

  return (
    <>
      <div className={cn(["", className])}>
        <Popover open={show} onOpenChange={setShow}>
          <PopoverAnchor>
            <Input
              disabled={disablePicker}
              disabledTooltip={disabledTooltip}
              label={label}
              value={FORMATTED_DATE}
              placeholder={placeholder || "Pick a Date"}
              RightIcon={CalendarIcon}
              onIconClick={() => !show && setShow(true)}
              errorBorder={!!error}
              onClick={() => !show && setShow(true)}
              optionalText={optionalText}
              error={error}
              classNames={{
                rightIcon: "cursor-pointer",
              }}
            />
          </PopoverAnchor>

          <PopoverContent className="w-auto p-0" align="start">
            <PopoverArrow className="fill-white-100  stroke-white-100" />
            <Calendar
              onDayClick={() => {
                setShow(false);
              }}
              {...calenderProps}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default DatePicker;

