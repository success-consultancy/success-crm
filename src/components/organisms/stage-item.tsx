import { cn } from "@/lib/utils";

interface StageProps {
    name: string;
    active?: boolean;
    completed?: boolean;
    isFirst?: boolean;
    days?: number | null;
    handleStageChange: (stage: string) => void;
}

const StageItem = ({ name, active, completed, isFirst, days, handleStageChange }: StageProps) => {
    const baseClasses =
        'relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium whitespace-nowrap w-full';
    const activeClasses = 'bg-primary-blue text-white';
    const completedClasses = 'text-gray-800 cursor-pointer';
    const inactiveClasses = 'bg-gray-100 text-gray-800 cursor-pointer';
    const pointSize = 15;

    const clipPathValue = isFirst
        ? `polygon(0 0, calc(100% - ${pointSize}px) 0, 100% 50%, calc(100% - ${pointSize}px) 100%, 0 100%)`
        : `polygon(0 0, calc(100% - ${pointSize}px) 0, 100% 50%, calc(100% - ${pointSize}px) 100%, 0 100%, ${pointSize}px 50%)`;

    const bgStyle = completed && !active ? { backgroundColor: '#E2ECF3' } : {};

    return (
        <div className="group relative flex flex-col items-center w-full">
            {days != null && days > 0 && (
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <span className="inline-block whitespace-nowrap rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-white">
                        {days} days
                    </span>
                </div>
            )}
            <div
                className={cn(
                    baseClasses,
                    active ? activeClasses : completed ? completedClasses : inactiveClasses,
                    !isFirst && `-ml-[${pointSize}px]`,
                )}
                style={{ clipPath: clipPathValue, ...bgStyle }}
                onClick={() => !active && handleStageChange(name)}
            >
                {name}
            </div>
        </div>
    );
};

export default StageItem
