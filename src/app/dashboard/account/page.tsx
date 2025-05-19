"use client";

import Avatar from "react-avatar";
import React, { useState } from "react";
import { ROUTES } from "@/app/config/routes";
import Portal from "@/components/common/portal";
import { PortalIds } from "@/app/config/portal";
import Container from "@/components/common/container";

import PersonalDetailsTab from "./_components/personal-details-tab";
import { useGetUserProfile } from "@/query/get-user-profile";

const Account = () => {
  const { data: user, isLoading } = useGetUserProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const name = user?.firstName + " " + user?.lastName;
  return (
    <Container className="flex flex-col py-4 max-h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">
          Account Setting
        </h3>
      </Portal>
      <div className="container bg-white py-6 rounded-xl">
        <div>
          <div className="flex gap-4 items-center">
            <Avatar
              name={name}
              round
              className="w-[88px] h-[88px] text-[24px]"
            />
            <div className="flex flex-col">
              <h1 className="text-bu-l">{name}</h1>
              <span className="text-c1">Super admin</span>
            </div>
          </div>
        </div>
        <div>
          <PersonalDetailsTab user={user} />
        </div>
      </div>
    </Container>
  );
};

export default Account;
