import { cn } from "@/lib/utils";

type Props = {
  title: string;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
};

const Stage = (props: Props) => {
  return (
    <div className="relative">
      {/* Main banner */}
      <div
        className={cn([
          "text-white relative flex items-center justify-center min-h-10 bg-[#E2ECF3]",
          props.isActive && "bg-primary-blue",
        ])}
      >
        <span
          className={cn([
            "text-sm font-[500] px-12 text-black",
            props.isActive && "text-white",
          ])}
        >
          {props.title}
        </span>

        {/* Left arrow point */}
        {!props.isFirst && (
          <div className="absolute left-0 top-0 h-full w-0 border-t-[20px] border-b-[20px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"></div>
        )}

        {/* Right arrow point */}
        {!props.isLast && (
          <div
            className={cn([
              "absolute right-0 top-0 h-full w-0 border-t-[20px] border-b-[20px] border-l-[12px] border-t-transparent border-b-transparent border-l-[#E2ECF3] translate-x-3",
              props.isActive && "border-l-primary-blue",
            ])}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Stage;
