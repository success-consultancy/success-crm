import Image from 'next/image';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="w-full flex h-screen">
      <Image
        src="/login-side-image.jpg"
        alt="side-image"
        height={100}
        width={100}
        className="w-full h-full object-fill"
        unoptimized
      />

      <div className="h-full w-full flex items-center justify-center">{props.children}</div>
    </div>
  );
};

export default layout;
