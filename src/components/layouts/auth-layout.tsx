import React from "react";
import AuthSidebar from "../templates/auth-sidebar";

type Props = {
  children?: React.ReactNode;
};

const AuthLayout = (props: Props) => {
  return (
    <main className="h-screen overflow-hidden flex">
      <AuthSidebar />
      <div className="max-w-md w-full mx-auto flex justify-center items-center px-4 md:px-0">
        {props.children}
      </div>
    </main>
  );
};

export default AuthLayout;
