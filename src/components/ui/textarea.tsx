import * as React from "react";

import { cn } from "@/lib/utils";
import FormErrorMessage from "../atoms/form-error-message";
import { Label } from "./label";

function Textarea({
  className,
  error,
  label,
  ...props
}: React.ComponentProps<"textarea"> & {
  error?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <Label data-slot="label" className="text-base font-medium">
        {label}
      </Label>
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input focus:border-primary placeholder:text-muted-foreground aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
      <FormErrorMessage message={error} />
    </div>
  );
}

export { Textarea };
