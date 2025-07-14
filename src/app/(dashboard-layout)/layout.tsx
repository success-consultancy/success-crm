import ProtectedLayout from "@/components/layouts/protected-layout";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

const layout = (props: Props) => {
  return <ProtectedLayout>
    {props.children}
    </ProtectedLayout>;
};

export default layout;
