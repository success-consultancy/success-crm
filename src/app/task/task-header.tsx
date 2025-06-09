import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

const TaskHeader = () => {
  return (
    <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
      <SheetTitle className="text-xl font-semibold">Tasks</SheetTitle>
    </SheetHeader>
  );
};
export default TaskHeader;
