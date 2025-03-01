import useSearchParams from "@/hooks/use-search-params";
import { cn } from "@/lib/cn";
import React from "react";

type Props = {
  currentStep: string;
  formSteps: string[];
};

const FormSteps = (props: Props) => {
  return (
    <div className="flex items-center gap-9">
      {props.formSteps.map((step, idx) => {
        const isLast = idx + 1 === props.formSteps.length;
        return (
          <IndividualStep
            step={step}
            index={idx + 1}
            isLast={isLast}
            key={idx}
            currentStep={props.currentStep}
          />
        );
      })}
    </div>
  );
};

const IndividualStep = ({
  step,
  index,
  isLast,
  currentStep,
}: {
  step: string;
  index: number;
  isLast: boolean;
  currentStep: string;
}) => {
  const { setParam } = useSearchParams();
  return (
    <div
      className={cn([
        "flex items-center gap-9 cursor-pointer",
        currentStep === step
          ? "text-primary-blue"
          : "!text-neutral-inActiveGrey",
      ])}
      onClick={() => setParam("step", step)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn([
            "h-6 w-6 rounded-full border flex items-center justify-center text-b1-b",
            currentStep === step && "border-primary-blue",
          ])}
        >
          <span>{index}</span>
        </div>
        <span className="text-b1-b">{step}</span>
      </div>
      {!isLast && <div className="w-16 h-0.5 bg-neutral-border"></div>}
    </div>
  );
};

export default FormSteps;

