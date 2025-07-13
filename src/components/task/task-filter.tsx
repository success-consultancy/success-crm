import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskFilter = ({
  taskType,
  setTaskType,
  taskStatus,
  setTaskStatus,
  superAdmin,
  openAddTaskForm,
}: {
  taskType: string;
  setTaskType: (value: string) => void;
  taskStatus: string;
  setTaskStatus: (value: string) => void;
  superAdmin: boolean;
  openAddTaskForm: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 py-4 border-b px-3">
      <div className="flex gap-2">
        {superAdmin && (
          <Select
            value={taskType}
            onValueChange={(value) => setTaskType(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type: My tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="my-tasks">My tasks</SelectItem>
              <SelectItem disabled={!superAdmin} value="employee-tasks">
                Employee tasks
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select
          value={taskStatus}
          onValueChange={(value) => setTaskStatus(value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status: Upcoming" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={openAddTaskForm}
        size="sm"
        className="bg-primary text-white"
      >
        <span className="mr-1">+</span> Add task
      </Button>
    </div>
  );
};
export default TaskFilter;
