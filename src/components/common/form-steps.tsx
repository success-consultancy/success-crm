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
        return <IndividualStep step={step} index={idx + 1} isLast={isLast} />;
      })}
    </div>
  );
};

const IndividualStep = ({
  step,
  index,
  isLast,
}: {
  step: string;
  index: number;
  isLast: boolean;
}) => {
  return (
    <div className="flex items-center gap-9">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full border flex items-center justify-center text-b1-b">
          {index}
        </div>
        <span className="text-b1-b">{step}</span>
      </div>
      {!isLast && <div className="w-16 h-0.5 bg-black-4"></div>}
    </div>
  );
};

export default FormSteps;

