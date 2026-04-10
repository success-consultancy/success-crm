'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
}

const formatTaskDate = (date: Date): string => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const taskDate = startOfDay(date);
  if (isSameDay(taskDate, today)) return 'Today';
  if (isSameDay(taskDate, tomorrow)) return 'Tomorrow';
  return format(date, 'EEE, MMM d, yyyy');
};

const TaskList = ({ tasks, onEdit, onDelete, onComplete, onClearDate, onReorder, isCompleted }: TaskListProps) => {
  const [orderedTasks, setOrderedTasks] = useState<Task[]>(tasks ?? []);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const draggingIdRef = useRef<number | null>(null);

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
  }, [tasks]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const id = draggingIdRef.current;
    if (id === null) return;

    // Find which row the pointer is over
    for (const [taskId, el] of rowRefs.current) {
      if (taskId === id) continue;
      const rect = el.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        setDragOverId(taskId);
        return;
      }
    }
    setDragOverId(null);
  }, []);

  const handlePointerUp = useCallback(() => {
    const sourceId = draggingIdRef.current;
    const targetId = dragOverId;

    if (sourceId !== null && targetId !== null && sourceId !== targetId) {
      setOrderedTasks((prev) => {
        const fromIndex = prev.findIndex((t) => t.id === sourceId);
        const toIndex = prev.findIndex((t) => t.id === targetId);
        if (fromIndex === -1 || toIndex === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onReorder?.(next);
        return next;
      });
    }

    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);

    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [dragOverId, handlePointerMove, onReorder]);

  // Attach/detach global listeners when dragging starts
  useEffect(() => {
    if (draggingId !== null) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [draggingId, handlePointerMove, handlePointerUp]);

  const startDrag = (taskId: number) => {
    draggingIdRef.current = taskId;
    setDraggingId(taskId);
  };

  return (
    <div className="space-y-0.5" ref={containerRef}>
      {orderedTasks?.map((task) => {
        const parsedDate = task.dueDate ? new Date(task.dueDate) : undefined;
        const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
        const isDragging = draggingId === task.id;
        const isDragOver = dragOverId === task.id && draggingId !== task.id;

        return (
          <div
            key={task.id}
            ref={(el) => {
              if (el) rowRefs.current.set(task.id, el);
              else rowRefs.current.delete(task.id);
            }}
            className={cn(
              'group relative flex items-start gap-2 py-3 px-2 rounded-md hover:bg-gray-50 transition-colors',
              isDragging && 'opacity-40 bg-gray-50',
              isDragOver && 'border-t-2 border-blue-400',
            )}
          >
            {/* Drag handle — visible on hover, initiates pointer-based drag */}
            {!isCompleted && (
              <div
                onPointerDown={(e) => {
                  e.preventDefault();
                  startDrag(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 mt-0.5 touch-none select-none"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}

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
                className={cn('text-b1-b leading-tight text-neutral-darkGrey', task.isCompleted ? 'line-through' : '')}
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
                    <span className="flex items-center gap-1 text-c1-c bg-gray-100 rounded-md px-2 py-0.5  text-neutral-black">
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
