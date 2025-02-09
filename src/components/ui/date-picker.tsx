"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal py-[1.1875rem]",
            !selected && "text-muted-foreground"
          )}
        >
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(selected)}
          onSelect={(date) => onSelect(date as Date)}
          initialFocus
          className="min-w-[23.875rem]"
        />
      </PopoverContent>
    </Popover>
  );
}

