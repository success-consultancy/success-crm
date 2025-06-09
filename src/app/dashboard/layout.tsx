"use client";
import React, { ReactNode, Suspense } from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";
import { PortalIds } from "../config/portal";
import { TasksDrawer } from "../task/tasks-drawer";
import { ChevronDownIcon } from "lucide-react";
import Icons from "@/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "../config/routes";
import Avatar from "react-avatar";

type Props = {
  children: ReactNode;
};

const layout = (props: Props) => {
  const name = "Super Administrator";
  const router = useRouter();

  return (
    <div className="flex w-screen overflow-hidden h-screen">
      <DashboardSidebar />
      <div className="flex flex-col grow overflow-hidden">
        <div className="grow bg-bg-blueExtraLight overflow-y-auto flex flex-col">
          <div className="w-full border-b border-b-border-normal bg-neutral-white py-3 px-6 flex items-center justify-between sticky top-0">
            <div id={PortalIds.DashboardHeader}></div>
            <div className="flex gap-4 items-center">
              <Icons.FileCheckIcon className="cursor-pointer" />
              <Icons.BellIcon className="cursor-pointer" />
              <div
                className="flex align-center gap-1 cursor-pointer"
                onClick={() => router.push(ROUTES.PROFILE)}
              >
                <Avatar name={name} round size="28" className="mr-1" />

                {/* <Image
                  src="/success-logo-mini.png"
                  width="18"
                  height="18"
                  alt="success-logo"
                  className="mr-1"
                /> */}
                <span>{name}</span>
                <ChevronDownIcon className="w-[16px]" />
              </div>
            </div>
          </div>
          <Suspense>{props.children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default layout;
