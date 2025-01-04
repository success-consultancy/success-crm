"use client";

import { ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import useSearchParams from "@/hooks/use-search-params";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  keyParam: string;
};

const ColumnHeader = (props: Props) => {
  const [sortingState, setSortingState] = useState<string | undefined>();
  const [hovered, setHovered] = useState(false);
  const { searchParams, setParams } = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("order")) {
      setSortingState(undefined);
    }
    if (sortingState) {
      setParams([
        {
          name: "order",
          value: sortingState,
        },
        {
          name: "order_by",
          value: props.keyParam,
        },
        {
          name: "page",
          value: null,
        },
      ]);
    }
    //eslint-disable-next-line
  }, [sortingState, searchParams]);

  const handleArrowClick = () => {
    if (sortingState) {
      if (sortingState === "asc") {
        setSortingState("desc");
      } else {
        setSortingState("asc");
      }
    } else {
      setSortingState("asc");
    }
  };

  return (
    <div
      className="flex items-center cursor-pointer h-fit gap-1 "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{props.title}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {(hovered || !!sortingState) && (
              <ArrowUp
                className={cn([
                  "h-4 w-4",
                  sortingState === "desc" && "rotate-180",
                ])}
                strokeWidth={2}
                onClick={() => handleArrowClick()}
              />
            )}
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={20}
            className="text-b2-b bg-white-100"
          >
            <span>
              Sort {sortingState === "asc" ? "descending" : "ascending"} by{" "}
              {props.title}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ColumnHeader;

