import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";
import { LoaderCircle } from "lucide-react";

const buttonVariants = cva(
  "inline-flex relative shrink-0 items-center justify-center whitespace-nowrap rounded-[.375rem] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white-100 hover:bg-primary-hovered active:bg-hovered",
        destructive:
          "bg-state-error-base text-white-100 hover:bg-state-error-dark active:bg-button-800",
        destructiveHover:
          "hover:bg-state-error-light  hover:text-state-error-base",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-white-100 border border-stroke text-button-700 hover:bg-button-50 hover:border-button-700 active:bg-button-100 active:border-button-700",
        tertiary:
          "bg-transparent text-button-700 hover:bg-accent-50 active:bg-accent-100",
        ghost: "hover:bg-accent-50 text-accent-700 active:bg-accent-100",
        actionIcon:
          "shrink-0 inline-grid place-items-center rounded hover:bg-accent-50",
        link: "text-primary underline-offset-4 hover:underline",
        filterButton:
          "inline-flex text-b1 items-center text-button-700  shrink-0 rounded hover:bg-accent-50",
        option:
          "rounded-full overflow-hidden hover:bg-black-8 inline-grid place-items-center",
      },
      size: {
        default: "h-9 px-5  !text-bu-m ",
        sm: "h-8 px-4 !text-bu-m",
        lg: "h-[42px] px-5 !text-bu-l",
        icon: "h-10 w-10",
        actionIcon: "w-6 h-6  inline-grid place-items-center",
        filterButton: "py-2 px-1.5 gap-0.5",
        optionSm: "w-8 h-8",
        optionMd: "w-9 h-9",
        optionLg: "size-[2.625rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      loading,
      disabled,
      type,
      ...props
    },
    ref
  ) => {
    const isDisabled = loading || disabled;

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "relative",
          // loading && '[&>*:not(:first-child)]:opacity-0',
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        disabled={isDisabled}
        type={type || "button"}
        {...props}
      >
        {loading && (
          <span className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoaderCircle className="w-5 h-5 animate-spin " />
          </span>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

