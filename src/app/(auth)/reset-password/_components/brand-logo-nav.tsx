import * as React from 'react';

import { cn } from '@/lib/cn';
import { Link } from '@/lib/navigation';
import Icons from '@/components/icons';
import { ROUTES } from '@/config/routes';
import { ClipFromLeftAnimation } from '@/components/common/animations';

interface IBrandLogoNavProps {
  isCollapsed?: boolean;
  className?: string;
}

const BrandLogoNav: React.FC<IBrandLogoNavProps> = (props) => {
  return (
    <Link
      href={ROUTES.LOGIN}
      className={cn(['relative duration-200 flex items-center gap-1 pl-4 3xl:pl-5', props.className])}
    >
      <Icons.OneAccordIcon className="w-10 h-10" />

      <ClipFromLeftAnimation show={!props.isCollapsed}>
        <Icons.OneAccordLetterIcon className="w-[8.5rem] h-6" />
      </ClipFromLeftAnimation>
    </Link>
  );
};

export { BrandLogoNav };
