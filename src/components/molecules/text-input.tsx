import React, { forwardRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormErrorMessage from "../atoms/form-error-message";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  error?: string;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, id, error, required, className, ...rest }, ref) => {
    const inputId = id || "text-input";

    return (
      <div className="space-y-1">
        {label && (
          <Label htmlFor={inputId} className="font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </Label>
        )}

        <Input
          id={inputId}
          ref={ref}
          required={required}
          {...rest}
          className={cn(
            "w-full mt-2 rounded-md border px-3 py-2 focus:border-primary",
            className
          )}
        />

        <FormErrorMessage message={error} />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
