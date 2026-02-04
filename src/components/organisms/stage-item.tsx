import { cn } from "@/lib/utils";

interface StageProps {
    name: string;
    active?: boolean;
    isFirst?: boolean;
    handleStageChange: (stage: string) => void;
}

const StageItem = ({ name, active, isFirst, handleStageChange }: StageProps) => {
    const baseClasses =
        'relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium whitespace-nowrap w-full';
    const inactiveClasses = 'bg-gray-100 text-gray-800 cursor-pointer';
    const activeClasses = 'bg-primary-blue text-white';
    const pointSize = 15;

    const clipPathValue = isFirst
        ? `polygon(0 0, calc(100% - ${pointSize}px) 0, 100% 50%, calc(100% - ${pointSize}px) 100%, 0 100%)`
        : `polygon(0 0, calc(100% - ${pointSize}px) 0, 100% 50%, calc(100% - ${pointSize}px) 100%, 0 100%, ${pointSize}px 50%)`;

    return (
        <div
            className={cn(baseClasses, active ? activeClasses : inactiveClasses, !isFirst && `-ml-[${pointSize}px]`)}
            style={{ clipPath: clipPathValue }}
            onClick={() => !active && handleStageChange(name)}
        >
            {name}
        </div>
    );
};

export default StageItem