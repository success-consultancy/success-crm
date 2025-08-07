import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  text: React.ReactNode;
  className?: string;
};

const Heading = (props: Props) => {
  return <h2 className={cn('text-[29px] font-medium', props.className)}>{props.text}</h2>;
};

export default Heading;
