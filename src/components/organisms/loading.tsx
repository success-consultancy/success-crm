import { cn } from '@/lib/utils';
import * as React from 'react';
import { Spinner } from '@/components/common/spinner';

interface ILoadingProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  /** Fills the viewport instead of the surrounding section. */
  fullScreen?: boolean;
}
const loader = (props: ILoadingProps) => {
  return (
    <div
      className={cn([
        'w-full grid place-items-center',
        props.fullScreen ? 'h-screen' : 'min-h-[300px]',
        props.className,
      ])}
      suppressHydrationWarning
    >
      <div className="flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-6 text-center text-b14 text-neutral-light-grey">Loading...</p>
      </div>
    </div>
  );
};

const Loading: React.FC<ILoadingProps> = (props) => {
  if (props.children) {
    if (props.isLoading) {
      return loader(props);
    }

    return <>{props.children}</>;
  }

  return loader(props);
};

export default Loading;
