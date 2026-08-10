'use client';

import { useEffect, useRef, useState } from 'react';
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
  onReorder?: (tasks: Task[]) => void;
  isCompleted?: boolean;
  editingTaskId?: number | null;
  renderEditForm?: () => React.ReactNode;
}

/**
 * How long the row stays visible after its checkbox is ticked. The mutation is
 * dispatched at the end of this window so the user actually sees the check land
 * and the row collapse, instead of the task vanishing mid-click.
 */
const COMPLETE_EXIT_MS = 320;

const formatTaskDate = (date: Date): string => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const taskDate = startOfDay(date);
  if (isSameDay(taskDate, today)) return 'Today';
  if (isSameDay(taskDate, tomorrow)) return 'Tomorrow';
  return format(date, 'EEE, MMM d, yyyy');
};

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onClearDate,
  onReorder,
  isCompleted,
  editingTaskId,
  renderEditForm,
}: TaskListProps) => {
  const [orderedTasks, setOrderedTasks] = useState<Task[]>(tasks ?? []);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  // Tasks whose checkbox has been ticked but whose refetch hasn't landed yet.
  const [completingIds, setCompletingIds] = useState<number[]>([]);

  // Refs to track drag source and target — avoids stale closure issues
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const exitTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Don't leave a pending toggle firing after the drawer closes.
  useEffect(() => {
    const timers = exitTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Keep local order in sync when the incoming task list changes (add/remove/refetch).
  useEffect(() => {
    setOrderedTasks((prev) => {
      const incoming = tasks ?? [];
      const incomingIds = new Set(incoming.map((t) => t.id));
      const prevIds = new Set(prev.map((t) => t.id));
      const sameSet = incomingIds.size === prevIds.size && [...incomingIds].every((id) => prevIds.has(id));

      if (sameSet) {
        const byId = new Map(incoming.map((t) => [t.id, t]));
        return prev.map((t) => byId.get(t.id) ?? t);
      }
      return incoming;
    });

    // Once a completed task has left the list, forget its pending state.
    const incomingIds = new Set((tasks ?? []).map((t) => t.id));
    setCompletingIds((prev) => {
      const next = prev.filter((id) => incomingIds.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [tasks]);

  const handleToggleComplete = (task: Task) => {
    if (!onComplete || completingIds.includes(task.id)) return;

    // Show the new state straight away, then dispatch once the row has animated out.
    setCompletingIds((prev) => [...prev, task.id]);
    const timer = setTimeout(() => onComplete(task.id, !task.isCompleted), COMPLETE_EXIT_MS);
    exitTimers.current.push(timer);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newList = [...orderedTasks];
      const [draggedTask] = newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, draggedTask);
      setOrderedTasks(newList);
      onReorder?.(newList);
    }

    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-0.5">
      {orderedTasks?.map((task, index) => {
        if (editingTaskId === task.id && renderEditForm) {
          return <div key={task.id}>{renderEditForm()}</div>;
        }

        const parsedDate = task.dueDate ? new Date(task.dueDate) : undefined;
        const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
        const isDragging = draggingIndex === index;
        const isDragOver = dragOverIndex === index && draggingIndex !== index;
        const isLeaving = completingIds.includes(task.id);
        // While leaving, render the state the user just chose, not the stale server value.
        const showChecked = isLeaving ? !task.isCompleted : !!task.isCompleted;
        const canToggle = !!onComplete && !isLeaving;

        return (
          <div
            key={task.id}
            // grid-rows 0fr/1fr collapses the row to zero height regardless of its
            // content height, so the tasks below slide up instead of snapping.
            className={cn(
              'grid transition-all duration-300 ease-out',
              isLeaving ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
            )}
            aria-hidden={isLeaving}
          >
            <div className={cn('overflow-hidden', isLeaving && 'pointer-events-none')}>
              <div
                draggable={!isCompleted && !isLeaving}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                className={cn(
                  'group relative flex items-start gap-2 py-3 px-2 rounded-md hover:bg-gray-50 transition-colors',
                  isDragging && 'opacity-40 bg-gray-50',
                  isDragOver && 'border-t-2 border-blue-400',
                )}
              >
                {/* Drag handle — visible on hover */}
                {!isCompleted && (
                  <div className="opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 mt-0.5 select-none">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}

                {/* Complete toggle circle */}
                <button
                  type="button"
                  onClick={() => handleToggleComplete(task)}
                  disabled={!canToggle}
                  aria-pressed={showChecked}
                  aria-label={showChecked ? 'Mark task as not done' : 'Mark task as done'}
                  className={cn(
                    'mt-[2px] w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    'transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-1',
                    showChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300',
                    // Only advertise interactivity where a handler exists — the
                    // completed list is read-only, so its circles shouldn't invite clicks.
                    canToggle
                      ? 'cursor-pointer motion-safe:active:scale-90 ' +
                          (showChecked
                            ? 'motion-safe:scale-110'
                            : 'hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100')
                      : 'cursor-default',
                  )}
                >
                  <Check
                    className={cn(
                      'w-[10px] h-[10px] text-white transition-transform duration-150',
                      showChecked ? 'scale-100' : 'scale-0',
                    )}
                    strokeWidth={3}
                  />
                </button>

                {/* Task content */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !isCompleted && onEdit?.(task.id)}>
                  {/* Title */}
                  <p
                    className={cn(
                      'text-b1-b leading-tight text-neutral-darkGrey transition-colors duration-150',
                      showChecked && 'line-through text-gray-400',
                    )}
                  >
                    {task.detail || 'Untitled task'}
                  </p>

                  {/* Description */}
                  {task.detailDescription && (
                    <p className="text-c2 text-neutral-darkGrey mt-0.5 leading-snug">{task.detailDescription}</p>
                  )}

                  {/* Date / Time / User chips */}
                  {(validDate || task.dueTime || task.user) && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {validDate && (
                        <span className="flex items-center gap-1 text-c1-c bg-gray-100 rounded-md px-2 py-0.5 text-neutral-black">
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
                        <span className="flex items-center gap-1 text-c1-c bg-gray-100 rounded-md px-2 py-0.5 text-neutral-black">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{task.dueTime}</span>
                        </span>
                      )}

                      {task.user && (
                        <span className="flex items-center gap-1 text-c1-c bg-gray-100 rounded-md px-2 py-0.5 text-neutral-black">
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
                    <p className="text-c2 text-neutral-darkGrey mt-1">
                      Completed on: {format(validDate, 'EEE, MMM d, yyyy')}
                    </p>
                  )}
                </div>

                {/* Delete button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  aria-label="Delete task"
                  className={cn(
                    'flex-shrink-0 mt-0.5 rounded p-0.5 text-gray-400 cursor-pointer transition-all duration-150',
                    'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
                    'hover:text-red-500 hover:bg-red-50 active:bg-red-100 active:text-red-600',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50',
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
