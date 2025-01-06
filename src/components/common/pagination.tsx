import * as React from "react";

import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";

interface PaginationProps
  extends Omit<React.ComponentPropsWithRef<"div">, "children"> {
  currentPage?: number;
  totalItems: number;
  offset: number;
  counterHidden?: boolean;
  onNextClick?: (nextPage: number) => void;
  onPreviousClick?: (previousPage: number) => void;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      currentPage = 1,
      offset,
      totalItems,
      counterHidden = false,
      onPreviousClick,
      onNextClick,
      ...props
    },
    ref
  ) => {
    // pagination variable calculations
    const FROM = totalItems > 0 ? offset * (currentPage - 1) + 1 : 0;
    const TOTAL_CAPACITY_ITEMS = currentPage * offset;
    const TO =
      TOTAL_CAPACITY_ITEMS > totalItems ? totalItems : currentPage * offset;

    const hasMore = TO < totalItems;
    const hasLess = currentPage > 1;

    // handlers
    const handleNextClick = () => {
      if (!hasMore) return;
      onNextClick?.(currentPage + 1);
    };

    const handlePreviusClick = () => {
      if (!hasLess) return;
      onPreviousClick?.(currentPage - 1);
    };

    return (
      <div
        ref={ref}
        className={cn([
          "inline-flex shrink-0 items-center gap-1 xl:gap-x-5",
          className,
        ])}
        {...props}
      >
        <span className={counterHidden ? "hidden" : ""}>
          {FROM} - {TO} of {totalItems ?? "0"}
        </span>

        <div
          className={cn([
            "inline-flex items-center",
            counterHidden ? "" : "gap-0.5 xl:gap-x-3",
          ])}
        >
          <button
            onClick={handlePreviusClick}
            disabled={!hasLess}
            type="button"
            className={cn([
              "p-1 rounded duration-200",
              hasLess ? "hover:bg-black-10 active:scale-90" : "opacity-50",
            ])}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {counterHidden && <Separator />}
          <button
            onClick={handleNextClick}
            disabled={!hasMore}
            type="button"
            className={cn([
              "p-1 rounded duration-200",
              hasMore ? "hover:bg-black-10 active:scale-90" : "opacity-50",
            ])}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);

export default Pagination;

