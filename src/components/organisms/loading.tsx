import { cn } from '@/lib/utils';
import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface ILoadingProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}
const loader = (props: ILoadingProps) => {
  return (
    <div className={cn(['w-full h-screen grid place-items-center', props.className])} suppressHydrationWarning>
      <div>
        <Loader2 className="w-20 h-20" />
        <p className="animate-pulse text-b2 mt-6 text-center"> Loading...</p>
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
