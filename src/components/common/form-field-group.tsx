import { cn } from "@/lib/cn";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  title: string;
};

const FormFieldGroup = (props: Props) => {
  return (
    <div
      className={cn([
        "w-full  border-2 rounded-lg py-5 px-7 flex flex-col gap-2",
        props.className,
      ])}
    >
      <h5>{props.title}</h5>
      {props.children}
    </div>
  );
};

export default FormFieldGroup;

