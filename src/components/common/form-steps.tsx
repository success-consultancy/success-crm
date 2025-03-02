import { LeadsFormSteps } from "@/app/config/leads-form-steps";
import useSearchParams from "@/hooks/use-search-params";
import { cn } from "@/lib/cn";
import { TickCircle } from "iconsax-react";
import { Check } from "lucide-react";
import React from "react";

type Props = {
  currentStep: string;
  formSteps: string[];
  completedSteps: LeadsFormSteps[];
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
            completedSteps={props.completedSteps}
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
  completedSteps,
}: {
  step: string;
  index: number;
  isLast: boolean;
  currentStep: string;
  completedSteps: LeadsFormSteps[];
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
            completedSteps.includes(step as LeadsFormSteps) &&
              currentStep !== step &&
              "bg-primary-blue",
          ])}
        >
          {completedSteps.includes(step as LeadsFormSteps) &&
          currentStep !== step ? (
            <Check className="text-neutral-white size-4" />
          ) : (
            <span>{index}</span>
          )}
        </div>
        <span
          className={cn([
            "text-b1-b",
            completedSteps.includes(step as LeadsFormSteps) &&
              currentStep !== step &&
              "text-b1-b text-neutral-black ",
          ])}
        >
          {step}
        </span>
      </div>
      {!isLast && <div className="w-16 h-0.5 bg-neutral-border"></div>}
    </div>
  );
};

export default FormSteps;

