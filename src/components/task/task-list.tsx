'use client';

import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { Calendar, Check, Clock, GripVertical, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  detail?: string;
  detailDescription?: string;
  dueDate?: string | Date;
  dueTime?: string;
  isCompleted?: boolean;
  userId?: number;
  user?: { firstName: string; lastName: string };
}

interface TaskListProps {
  tasks: Task[];
  onEdit?: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete?: (id: number, isCompleted: boolean) => void;
  onClearDate?: (id: number) => void;
  isCompleted?: boolean;
}

const formatTaskDate = (date: Date): string => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const taskDate = startOfDay(date);
  if (isSameDay(taskDate, today)) return 'Today';
  if (isSameDay(taskDate, tomorrow)) return 'Tomorrow';
  return format(date, 'EEE, MMM d, yyyy');
};

const TaskList = ({ tasks, onEdit, onDelete, onComplete, onClearDate, isCompleted }: TaskListProps) => {
  return (
    <div className="space-y-0.5">
      {tasks?.map((task) => {
        const parsedDate = task.dueDate ? new Date(task.dueDate) : undefined;
        const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;

        return (
          <div
            key={task.id}
            className="group relative flex items-start gap-2 py-3 px-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            {/* Drag handle on hover */}
            <div className="opacity-0 group-hover:opacity-100 absolute left-[-14px] top-3.5 cursor-grab text-gray-300 transition-opacity">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Complete toggle circle */}
            <button
              type="button"
              onClick={() => onComplete?.(task.id, !task.isCompleted)}
              className={cn(
                'mt-[2px] w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                task.isCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400',
              )}
            >
              {task.isCompleted && <Check className="w-[10px] h-[10px] text-white" strokeWidth={3} />}
            </button>

            {/* Task content */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !isCompleted && onEdit?.(task.id)}>
              {/* Title */}
              <p
                className={cn(
                  'text-sm font-medium leading-tight',
                  task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800',
                )}
              >
                {task.detail || 'Untitled task'}
              </p>

              {/* Description */}
              {task.detailDescription && (
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{task.detailDescription}</p>
              )}

              {/* Date / Time / User chips */}
              {(validDate || task.dueTime || task.user) && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {validDate && (
                    <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-600">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{formatTaskDate(validDate)}</span>
                      {task.dueTime && (
                        <>
                          <span className="text-gray-400 mx-0.5">|</span>
                          <span>{task.dueTime}</span>
                        </>
                      )}
                      {!isCompleted && onClearDate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearDate(task.id);
                          }}
                          className="ml-0.5 text-gray-400 hover:text-gray-700"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  )}

                  {!validDate && task.dueTime && (
                    <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-600">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{task.dueTime}</span>
                    </span>
                  )}

                  {task.user && (
                    <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-600">
                      <UserPlus className="w-3 h-3 flex-shrink-0" />
                      <span>
                        {task.user.firstName} {task.user.lastName}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {/* Completed on date */}
              {isCompleted && validDate && (
                <p className="text-xs text-gray-400 mt-1">Completed on: {format(validDate, 'EEE, MMM d, yyyy')}</p>
              )}
            </div>

            {/* Delete button on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-400 hover:text-red-500 transition-all mt-0.5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
