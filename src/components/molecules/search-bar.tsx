"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SearchNormal1 } from "iconsax-reactjs";
import { useQueryState } from "nuqs";

import { Input } from "../ui/input";
import { debounce } from "@/utils/debounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  queryKey?: string;
  className?: string;
}

const SearchBar = ({ queryKey = "query", className }: SearchBarProps) => {
  const [query, setQuery] = useQueryState(queryKey);
  const [inputValue, setInputValue] = useState(query || "");

  // Sync initial query to local input state
  useEffect(() => {
    setInputValue(query || "");
  }, [query]);

  // Debounced version of setQuery
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
      }, 500),
    [setQuery]
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  return (
    <div className={cn("relative w-full max-w-xs", className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(value);
          debouncedSetQuery(value);
        }}
        placeholder="Search"
        className="border p-2 rounded-lg w-full pl-10"
      />
      <SearchNormal1
        strokeWidth={2}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        size="20"
      />
    </div>
  );
};

export default SearchBar;
