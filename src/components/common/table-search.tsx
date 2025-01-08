"use client";
import React from "react";

import Input, { InputProps } from "@/components/common/input";
import useDebounceCallback from "@/hooks/use-debounce-callback";
import { PAGE_PARAM, SEARCH_PARAM } from "@/hooks/use-pagination";
import useSearchParams from "@/hooks/use-search-params";
import { Search } from "lucide-react";

/** info: This component is used to render a search query input  with debounce functionality
 *  custom query key can be passed as a prop to the component as `searchParamKey`
 */

const TableSearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "onChange" | "value"> & {
    searchParamKey?: string;
    LeftIcon?: React.FC<React.ComponentProps<"svg">>;
    searchParamField: string;
  }
>(
  (
    {
      LeftIcon,
      searchParamKey = SEARCH_PARAM,
      searchParamField,
      ...inputProps
    },
    ref
  ) => {
    const { searchParams, setParams } = useSearchParams();

    const searchQuery = searchParams.get(searchParamKey) || "";

    const [visibleValue, setVisibleValue] = React.useState(searchQuery);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // removes page param from URL search params
      const value = e.target.value;
      if (!!value) {
        setParams(
          [
            {
              name: "q_field",
              value: searchParamField,
            },
            {
              name: searchParamKey,
              value,
            },
            {
              name: PAGE_PARAM,
              value: null,
            },
          ],
          {
            scroll: false,
          }
        );
      } else {
        setParams(
          [
            {
              name: searchParamKey,
              value: null,
            },
            {
              name: "q_field",
              value: null,
            },
            {
              name: PAGE_PARAM,
              value: null,
            },
          ],
          {
            scroll: false,
          }
        );
      }
    };

    // clears the input value when search query is cleared from other components
    React.useEffect(() => {
      if (!searchQuery) {
        setVisibleValue("");
      }
    }, [searchQuery]);

    const debouncedHandleQueryChange = useDebounceCallback(
      handleQueryChange,
      500
    );

    return (
      <Input
        ref={ref}
        {...inputProps}
        value={visibleValue}
        onChange={(e) => {
          debouncedHandleQueryChange(e);
          setVisibleValue(e.target.value);
        }}
        LeftIcon={LeftIcon || Search}
      />
    );
  }
);

export default TableSearchInput;

