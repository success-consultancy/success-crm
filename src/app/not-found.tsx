import Link from "next/link";
import DashboardSidebar from "./dashboard/_components/dashboard-sidebar";
import { PortalIds } from "./config/portal";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <div className="flex w-screen overflow-hidden h-screen">
      <DashboardSidebar />
      <div className="flex flex-col grow overflow-hidden">
        <div className="grow bg-bg-blueExtraLight overflow-y-auto flex flex-col">
          <div className="w-full border-b border-b-border-normal bg-neutral-white py-3 px-6 flex items-center justify-between sticky top-0 z-[999]">
            <div id={PortalIds.DashboardHeader}></div>
            <div>User Profile</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-10 h-screen">
            <div className="text-h1 text-content-heading">404</div>
            <div className="text-b1 text-content-body">
              Oops! It looks like you&apos;ve reached a page that doesn&apos;t
              exist.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
