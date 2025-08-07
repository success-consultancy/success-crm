import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const CardContainer = (props: Props) => {
  return <div className={cn('bg-white border rounded-lg p-4 w-full', props.className)}>{props.children}</div>;
};

export default CardContainer;
