import React, { ReactNode } from 'react';
import Image from 'next/image';

type Props = {
  children: ReactNode;
};

const AuthGroupLayout = ({ children }: Props) => {
  return (
    <div className="w-full flex h-screen">
      {/* Left side - Image sidebar (35%) */}
      <aside className="w-[35%] relative h-full lg:flex hidden">
        <Image
          src="/login-side-image.jpg"
          alt="side-image"
          height={100}
          width={100}
          className="w-full h-full object-cover"
          unoptimized
        />
        <div className="w-full h-full bg-[#000000c2] absolute inset-0 m-auto"></div>
        <div className="absolute top-20 left-20 flex flex-col gap-10 text-white">
          <Image src={'/success-logo.png'} alt="logo" height={100} width={180} />
          <h1 className="text-h1 text-white font-bold">
            We
            <br />
            Deliver
            <br />
            Your Success
          </h1>
        </div>
      </aside>

      {/* Right side - Content (65%) */}
      <main className="h-full w-full lg:w-[65%] flex items-center justify-center px-5">
        <div className="w-full max-w-[424px]">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden mb-8">
            <Image src={'/success-logo.png'} alt="logo" height={100} width={180} />
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthGroupLayout;
