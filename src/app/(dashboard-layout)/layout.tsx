import React from "react";
import ProtectedLayout from "@/components/layouts/protected-layout";

type Props = {
  children?: React.ReactNode;
};

const layout = (props: Props) => {
  return <ProtectedLayout>{props.children}</ProtectedLayout>;
};

export default layout;
