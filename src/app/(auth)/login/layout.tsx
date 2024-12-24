import Image from "next/image";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="w-full flex h-screen">
      <aside className="w-[45%] relative h-full lg:flex hidden">
        <Image
          src="/login-side-image.jpg"
          alt="side-image"
          height={100}
          width={100}
          className="w-full h-full object-fill"
          unoptimized
        />
        <div className="w-full h-full bg-[#000000c2] absolute inset-0 m-auto"></div>
        <div className="absolute top-20 left-20 flex flex-col gap-10 text-white">
          <Image
            src={"/success-logo.png"}
            alt="logo"
            height={100}
            width={180}
          />
          <h3 className="text-h1 text-white-100 font-bold">
            We
            <br />
            Deliver
            <br />
            Your Success
          </h3>
        </div>
      </aside>
      <div className="h-full w-full flex items-center justify-center">
        {props.children}
      </div>
    </div>
  );
};

export default layout;

