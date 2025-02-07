import React from "react";

import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "iconsax-react";
import Link, { LinkProps } from "next/link";

interface ButtonLinkProps
  extends LinkProps,
    VariantProps<typeof buttonVariants>,
    Omit<React.ComponentProps<"a">, "href" | "ref"> {
  children?: React.ReactNode;
  LeftIcon?: React.FC<React.ComponentProps<"svg">>;
  RightIcon?: React.FC<React.ComponentProps<"svg">> | Icon;
  className?: string;
  classNames?: {
    leftIcon?: string;
    rightcon?: string;
  };
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      LeftIcon,
      RightIcon,
      classNames,
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {LeftIcon && <LeftIcon className={cn("mr-1", classNames?.leftIcon)} />}

        {children}

        {RightIcon && (
          <RightIcon className={cn("ml-1", classNames?.rightcon)} />
        )}
      </Link>
    );
  }
);

export type { ButtonLinkProps };
export { ButtonLink };

