import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  title: string;
  rightSection?: ReactNode;
  children: ReactNode;
};

const SectionWrapper = ({ className, title, children, rightSection }: Props) => {
  return (
    <div className={cn(['rounded-lg border', className])}>
      <div className="py-3 px-6 border-b text-base font-bold flex items-center justify-between">
        <span>{title}</span>
        {rightSection}
      </div>
      <div className="py-5 px-6">{children}</div>
    </div>
  );
};

export default SectionWrapper;
