import React from "react";

import Image from "next/image";
import { SuccessLogo } from "@/assets/images";

const SidebarLogo = () => {
  return (
    <div className="py-3 mb-4">
      <Image
        src={SuccessLogo.src}
        alt="logo"
        height={100}
        width={100}
        quality={70}
        className="h-12 w-auto"
      />
    </div>
  );
};

export default SidebarLogo;
