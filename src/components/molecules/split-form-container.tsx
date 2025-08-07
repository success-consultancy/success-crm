import React from 'react';
import CardContainer from '../atoms/card-container';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

const SplitFormContainer = (props: Props) => {
  return (
    <CardContainer className={cn(props.className)}>
      <div className="flex gap-6">
        <div className="w-64">
          <h3 className="font-medium text-xl">{props.title}</h3>
          <p className="text-gray-500">{props.description}</p>
        </div>
        <div className="grow">{props.children}</div>
      </div>
    </CardContainer>
  );
};

export default SplitFormContainer;
