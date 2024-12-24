import React, { ReactNode } from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";

type Props = {
  children: ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="flex w-screen overflow-hidden h-screen">
      <DashboardSidebar />
      <div className="flex flex-col grow overflow-hidden">
        <div className="grow bg-bg-light-grey overflow-y-auto flex flex-col">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default layout;

