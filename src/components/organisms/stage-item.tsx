import { cn } from "@/lib/utils";

interface StageProps {
    name: string;
    active?: boolean;
    completed?: boolean;
    isFirst?: boolean;
    handleStageChange: (stage: string) => void;
}

const StageItem = ({ name, active, completed, isFirst, handleStageChange }: StageProps) => {
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
    );
};

export default StageItem