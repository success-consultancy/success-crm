import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  className?: string;
};

const DotIcon = (props: Props) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn([props.className])}
    >
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
};

export default DotIcon;
