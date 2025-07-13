"use client";

import React, { useMemo, useEffect } from "react";
import { useQueryState } from "nuqs";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { debounce } from "@/utils/debounce";
import { Button } from "../ui/button";

const TOTAL_ITEMS = 389;

interface PaginationProps {
  showItemsPerPage?: boolean;
}

const PaginationComponent = ({ showItemsPerPage = true }: PaginationProps) => {
  const [page, setPage] = useQueryState("page", {
    history: "replace",
    parse: Number,
    serialize: String,
  });
  const [limit, setLimit] = useQueryState("limit", {
    history: "replace",
    parse: Number,
    serialize: String,
  });

  const currentPage = page || 1;
  const itemsPerPage = limit || 25;
  const totalPages = Math.ceil(TOTAL_ITEMS / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, TOTAL_ITEMS);

  const debouncedSetPage = useMemo(
    () =>
      debounce((value: number) => {
        setPage(value);
      }, 300),
    [setPage]
  );

  useEffect(() => {
    return () => {
      debouncedSetPage.cancel();
    };
  }, [debouncedSetPage]);

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1);
  };

  const goToPrev = () => {
    if (currentPage > 1) debouncedSetPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) debouncedSetPage(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-end gap-3 p-4 text-sm">
      {showItemsPerPage && (
        <div className="flex items-center gap-2">
          <span>Items per page</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>{`${start} - ${end} of ${TOTAL_ITEMS}`}</div>

      <Button
        variant={"ghost"}
        size="icon"
        onClick={goToPrev}
        disabled={currentPage === 1}
        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ArrowLeft2 size={20} />
      </Button>

      <Button
        variant={"ghost"}
        size="icon"
        onClick={goToNext}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ArrowRight2 size={20} />
      </Button>
    </div>
  );
};

export default PaginationComponent;
