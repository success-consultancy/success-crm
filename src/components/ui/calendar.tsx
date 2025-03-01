/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { cn } from "@/lib/cn";
import * as React from "react";
import Button from "@/components/common/button";
import { format, setMonth, setYear } from "date-fns";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";
import { Arrow } from "iconsax-react";
import { ScrollArea } from "./scroll-area";

export type DateValidationRules = {
  disabledDates?: {
    // Disable all dates before and after this date
    before?: Date;
    after?: Date;
  };
  // The starting and ending month for the calendar view (for limiting the calendar range default 100 year past and future)
  fromMonth?: Date;
  toMonth?: Date;

  // Custom function to validate if a date should be disabled. It will override other rules.
  // The function should return true to disable the date and false to keep it selectable
  customValidation?: (date: Date) => boolean;
};

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  validationRules?: DateValidationRules;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  validationRules,
  ...props
}: CalendarProps) {
  const today = new Date();

  // Note: the dropdown layout is available only when fromDate, fromMonth or fromYear and toDate, toMonth or toYear are set.
  const maxDate = new Date(
    today.getFullYear() - 0,
    today.getMonth(),
    today.getDate()
  ); // 0 years in the future
  const minDate = new Date(
    today.getFullYear() - 130,
    today.getMonth(),
    today.getDate()
  ); // 130 years in the past

  // Default date range validation
  const defaultValidation = (date: Date): boolean => {
    const beforeDate = validationRules?.disabledDates?.before || minDate;
    const afterDate = maxDate;
    return date < beforeDate || date > afterDate;
  };

  // Combined validation function
  const isDateDisabled = (date: Date): boolean => {
    // First check custom validation if provided
    if (validationRules?.customValidation) {
      return validationRules.customValidation(date);
    }
    // Fall back to default validation
    return defaultValidation(date);
  };

  return (
    <DayPicker
      fromMonth={validationRules?.fromMonth || minDate}
      toMonth={validationRules?.toMonth || maxDate}
      disabled={isDateDisabled}
      captionLayout="dropdown-buttons"
      showOutsideDays={showOutsideDays}
      className={cn(" bg-white-100 text-content-body ", className)}
      classNames={{
        months: "flex flex-col space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        caption_dropdowns: "flex gap-2 items-center mx-auto",
        month: "space-y-4  ",
        dropdown_month: "",
        dropdown_year: "",
        caption: "flex pt-1 item-center",
        caption_label: "text-sm hidden",
        dropdown: "",
        nav: "justify-between w-[90%] flex items-center absolute left-4  top-3.5",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "bg-transparent p-0 disabled:opacity-50 text-content-body"
        ),
        nav_button_previous: " ",
        nav_button_next: "",
        table: "!w-full border-collapse space-y-1 ",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] ",
        row: "flex w-full mt-2 justify-between ",
        cell: " text-b2 h-9 w-9 text-center text-sm p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent-50  first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 text-[.875rem] aria-selected:opacity-100 text-neutral-black"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary-blue !text-neutral-white hover:bg-accent-800 hover:text-white-100 focus:bg-accent-700 rounded-full",
        day_today:
          "border border-accent-700 hover:border-accent-800  hover:text-accent-800 text-accent-700",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-6 w-6 " />,
        IconRight: () => <ChevronRight className="h-6 w-6" />,
        Dropdown: (props) => {
          const [showYear, setShowYear] = React.useState(false);
          const [showMonth, setShowMonth] = React.useState(false);
          const [activeIndexYear, setActiveIndexYear] = React.useState("");
          const [activeIndexMonth, setActiveIndexMonth] = React.useState("");
          if (props.name === "years") {
            const { fromDate, fromMonth, fromYear, toDate, toMonth, toYear } =
              useDayPicker();
            const { currentMonth, goToMonth, goToDate } = useNavigation();
            const earliestYear =
              fromYear || fromMonth?.getFullYear() || fromDate?.getFullYear();
            const latestYear =
              toYear || toMonth?.getFullYear() || toDate?.getFullYear();
            const [newDate] = React.useState(new Date(currentMonth));

            const handleCancel = () => {
              setShowYear(false);
              setShowMonth(false);
            };
            let selectYears: { label: string; value: string }[] = [];

            if (earliestYear && latestYear) {
              const yearLength = latestYear - earliestYear + 1;
              selectYears = Array.from({ length: yearLength }, (_, i) => ({
                label: (earliestYear + i).toString(),
                value: (earliestYear + i).toString(),
              }));
            }
            const selectMonth = Array.from({ length: 12 }, (_, i) => ({
              value: i.toString(),
              label: format(setMonth(new Date(), i), "MMM"),
            }));

            return (
              <div className="z-50 text-[.875rem] ">
                <button
                  className="flex items-center gap-1 p-0 m-0"
                  onClick={() => setShowYear(!showYear)}
                >
                  {props.caption}
                  <ChevronDown className="h-4 w-4 " />
                </button>
                {showYear && (
                  <div>
                    <div
                      className={cn([
                        "absolute bg-neutral-white z-50 inset-0 py-5  rounded-lg",
                      ])}
                    >
                      <ScrollArea className="h-full w-full" type="hover">
                        <div className="grid grid-cols-3 gap-4 px-8 ">
                          {selectYears.map((selectYears) => (
                            <Button
                              variant={
                                activeIndexYear === selectYears.value
                                  ? "primary"
                                  : "ghost"
                              }
                              key={selectYears.value}
                              onClick={() => {
                                newDate.setFullYear(
                                  parseInt(selectYears.value)
                                );
                                setActiveIndexYear(selectYears.value);
                              }}
                              className={cn(
                                activeIndexYear !== selectYears.value &&
                                  "text-content-body"
                              )}
                            >
                              <span className="text-b1">
                                {selectYears.label}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="flex justify-end gap-1 absolute inset-x-0 bottom-0 z-50 p-4 bg-neutral-white">
                      <Button variant="tertiary" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setShowYear(!showYear);
                          setShowMonth(!showMonth);
                          goToMonth(newDate);
                        }}
                        disabled={!activeIndexYear}
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                )}
                {showMonth && (
                  <>
                    <div
                      className={cn([
                        "flex flex-col gap-4 bg-red-300 absolute bg-neutral-white z-50 inset-0 pt-8 px-8",
                      ])}
                    >
                      <div className=" flex justify-between items-center">
                        <Button
                          variant="ghost"
                          className="bg-transparent p-0 opacity-50 hover:opacity-100"
                          onClick={() => {
                            newDate.setFullYear(
                              parseInt(props.value as string) - 1
                            );
                            goToDate(newDate);
                          }}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <span className="text-b1 align-middle h-fit">
                          {props.caption}
                        </span>
                        <Button
                          variant="ghost"
                          className="bg-transparent p-0 opacity-50 hover:opacity-100"
                          onClick={() => {
                            newDate.setFullYear(
                              parseInt(props.value as string) + 1
                            );
                            goToDate(newDate);
                          }}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 w-full gap-4">
                        {selectMonth.map((items, i) => {
                          return (
                            <Button
                              key={i}
                              variant={
                                activeIndexMonth === items.value
                                  ? "primary"
                                  : "ghost"
                              }
                              onClick={() => {
                                newDate.setMonth(parseInt(items.value));
                                setActiveIndexMonth(items.value);
                              }}
                              className={cn(
                                activeIndexMonth !== items.value &&
                                  "text-content-body"
                              )}
                            >
                              <span className="text-b1">{items.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex justify-end gap-1 absolute inset-x-0 bottom-0 z-50 p-4 bg-neutral-white">
                      <Button variant="tertiary" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        disabled={!activeIndexMonth}
                        onClick={() => {
                          setShowMonth(false);
                          setShowYear(false);
                          goToMonth(newDate);
                        }}
                      >
                        OK
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          } else if (props.name === "months") {
            return <div className="my-auto">{props.caption}</div>;
          }
          return null;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

