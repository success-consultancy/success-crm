import React from "react";

import AuthLayout from "@/components/layouts/auth-layout";

type Props = {
  children?: React.ReactNode;
};

const layout = (props: Props) => {
  return <AuthLayout>{props.children}</AuthLayout>;
};

export default layout;
