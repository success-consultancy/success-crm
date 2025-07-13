import React from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ count } = { count: 15 }) => {
  const pageSize = 10;
  return (
    <>
      {Array.from({ length: pageSize }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: count }).map((_, cellIndex) => (
            <TableCell key={cellIndex} className="pr-4 py-3">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
