import { AuthSidebarImage } from "@/assets/images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Logo from "../atoms/logo";

interface Props {
  className?: string;
}

const AuthSidebar = (props: Props) => {
  return (
    <div
      className={cn(
        "hidden md:flex md:relative",
        "w-[480px] h-full",
        props.className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <Logo />
        <p className="mt-2 mb-5 text-2xl">
          Your one-stop solution for <br /> school management.
        </p>
      </div>
      <Image
        src={AuthSidebarImage.src}
        alt="Auth Sidebar Image"
        width={480}
        height={1080}
        className="object-cover h-full w-full"
      />
    </div>
  );
};

export default AuthSidebar;
