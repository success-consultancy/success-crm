import React, { ReactNode, Suspense } from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";
import { PortalIds } from "../config/portal";
import { TasksDrawer } from "../task/tasks-drawer";

type Props = {
  children: ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="flex w-screen overflow-hidden h-screen">
      <DashboardSidebar />
      <div className="flex flex-col grow overflow-hidden">
        <div className="grow bg-bg-blueExtraLight overflow-y-auto flex flex-col">
          <div className="w-full border-b border-b-border-normal bg-neutral-white py-3 px-6 flex items-center justify-between sticky top-0">
            <div id={PortalIds.DashboardHeader}></div>
            <div className="flex items-center ">
              <TasksDrawer />
              <p>User Profile</p>
            </div>
          </div>
          <Suspense>{props.children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default layout;
