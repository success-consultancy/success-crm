"use client";

// External packages
import React from "react";

// UI components
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import PageLoader from "../molecules/page-loader";
import AdminSidebar from "../templates/admin-sidebar";
import { cn } from "@/lib/utils";
import AdminHeader from "../templates/admin-header";

type Props = {
  children?: React.ReactNode;
};

const ProtectedLayout = (props: Props) => {
  const isLoggedIn = true;
  const isLoading = false;
  const showSidebar = true;

  if (isLoading) return <PageLoader />;

  return (
    <main className="flex h-screen w-full bg-bg transition-all bg-gray-25">
      {showSidebar && <AdminSidebar />}
      <div
        className={cn(
          "h-screen w-screen overflow-hidden transition-all flex flex-col",
          showSidebar ? "ml-64" : ""
        )}
      >
        <AdminHeader />
        <ScrollArea className="flex-1">
          <div className="overflow-auto h-full mx-auto py-8 px-6">
            {props.children}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </main>
  );
};

export default ProtectedLayout;
