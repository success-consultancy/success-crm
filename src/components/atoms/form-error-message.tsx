import React from "react";

type Props = {
  message?: string;
};

const FormErrorMessage = (props: Props) => {
  if (!props.message) {
    return null;
  }
  return <p className="text-sm text-red-600">{props.message}</p>;
};

export default FormErrorMessage;
