import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Tooltip from "@/components/common/tooltip";

interface Task {
  id: number;
  detail: string;
  dueDate: string;
  completed: boolean;
}

const TaskList = ({
  tasks,
  openEditTaskForm,
}: {
  tasks: Task[];
  openEditTaskForm: (id: number) => void;
}) => {
  return (
    <div className="space-y-2 py-4">
      {tasks?.map((task) => (
        <div
          key={task.id}
          className="flex items-center border-b py-4 px-4 hover:bg-gray-50 group"
        >
          <Checkbox checked={task.completed} className="mr-3 rounded-full" />
          <div className="flex-1 mr-2 text-sm">
            {/* TODO: show full text on tooltip on hover */}
            <span className="line-clamp-1">{task.detail}</span>
          </div>
          <Badge className="text-xs text-gray-500 mr-2">
            {new Date(task.dueDate).toDateString()}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditTaskForm(task.id)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};
export default TaskList;
