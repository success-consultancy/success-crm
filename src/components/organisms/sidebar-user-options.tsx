// External packages
import React from "react";
import { useRouter } from "next/navigation";
import { LogoutCurve } from "iconsax-reactjs";

const SidebarUserOptions = () => {
  const router = useRouter();
  return (
    <div className="p-4 flex items-center gap-3 cursor-pointer text-red">
      <LogoutCurve /> <span>Logout</span>
    </div>
  );
};
export default SidebarUserOptions;
