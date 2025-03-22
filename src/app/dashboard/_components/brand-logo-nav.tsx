import * as React from "react";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { ROUTES } from "@/app/config/routes";
import Image from "next/image";
import { ClipFromLeftAnimation } from "@/components/common/clip-from-left-animation";

interface IBrandLogoNavProps {
  isCollapsed?: boolean;
  className?: string;
}

const BrandLogoNav: React.FC<IBrandLogoNavProps> = (props) => {
  return (
    <Link
      href={ROUTES.DASHBOARD}
      className={cn([
        "relative duration-200 flex items-center gap-px pl-2.5",
        props.className,
      ])}
    >
      <div className="w-10 h-10  flex items-center justify-center">
        <Image
          src="/success-logo-mini.png"
          alt="mini-logo"
          height={40}
          width={40}
          className="object-contain"
        />
      </div>

      <ClipFromLeftAnimation show={!props.isCollapsed}>
        <div className="w-[6.5rem] h-full">
          <Image
            src="/success-logo-letter.png"
            alt="mini-logo"
            width={125}
            height={20}
            priority={true}
            className="object-cover h-auto w-[75%]"
          />
        </div>
      </ClipFromLeftAnimation>
    </Link>
  );
};

export { BrandLogoNav };

