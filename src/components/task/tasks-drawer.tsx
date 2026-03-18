'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useGetTasks } from '@/query/get-tasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAuthStore from '@/store/auth-store';
import { useGetUsers } from '@/query/get-user';
import taskFormSchema, { TaskSchemaType } from '@/schema/task-schema';
import { useAddTask, useEditTask } from '@/mutations/task/add-task';
import { useDeleteTask } from '@/mutations/task/delete-task';
import TaskForm from './task-form';
import TaskList from './task-list';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TaskIcon from '@/assets/icons/task-icon';
import EmptyTaskIcon from '@/assets/icons/empty-task-icon';
import { CheckCircle2, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TasksDrawer() {
  const { profile } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

  const superAdmin = profile?.roleId === 1;
  const userId = Number(profile?.id);

  const form = useForm<TaskSchemaType>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { detail: '', detailDescription: '', dueDate: undefined, dueTime: undefined, userId },
  });

  const { data: activeTasks = [] } = useGetTasks({
    userId,
    status: 'upcoming',
  });

  const { data: completedTasks = [] } = useGetTasks({
    userId,
    status: 'completed',
  });

  const { data: users } = useGetUsers();
  const addTask = useAddTask();
  const editTask = useEditTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (profile) {
      form.setValue('userId', profile.id as unknown as number);
    }
  }, [profile]);

  const openAddForm = () => {
    setEditingTaskId(null);
    form.reset({
      detail: '',
      detailDescription: '',
      dueDate: undefined,
      dueTime: undefined,
      userId,
    });
    setIsAddFormVisible(true);
  };

  const closeAddForm = () => {
    setIsAddFormVisible(false);
    setEditingTaskId(null);
    form.reset();
  };

  const openEditForm = (taskId: number) => {
    const task = activeTasks.find((t: any) => t.id === taskId);
    if (task) {
      setEditingTaskId(taskId);
      form.reset({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
      setIsAddFormVisible(true);
    }
  };

  const saveTask = async (data: TaskSchemaType) => {
    const payload = {
      ...data,
      userId: data.userId ?? userId,
    };

    if (editingTaskId) {
      await editTask.mutateAsync({ ...payload, id: editingTaskId });
    } else {
      await addTask.mutateAsync(payload);
    }
    closeAddForm();
  };

  const completeTask = (taskId: number, isCompleted: boolean) => {
    editTask.mutate({ id: taskId, isCompleted });
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask.mutate(taskId);
  };

  const handleClearDate = (taskId: number) => {
    editTask.mutate({ id: taskId, dueDate: undefined, dueTime: undefined });
  };

  const allCompleted = activeTasks.length === 0 && completedTasks.length > 0;

  return (
    <>
      <span className="cursor-pointer w-fit" onClick={() => setIsOpen(true)}>
        <TaskIcon />
      </span>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[420px] sm:w-[440px] p-0 flex flex-col bg-white border-l">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-base font-semibold text-gray-900">Tasks</h2>
          </div>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="px-5 py-4">
              {/* Add task link */}
              {!isAddFormVisible && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="flex items-center gap-1 text-sm text-primary font-medium mb-4 hover:opacity-75 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Add task
                </button>
              )}

              {/* Inline add / edit form */}
              {isAddFormVisible && (
                <TaskForm
                  form={form}
                  onSubmit={form.handleSubmit(saveTask)}
                  onCancel={closeAddForm}
                  isEditMode={!!editingTaskId}
                  superAdmin={superAdmin}
                  users={users}
                />
              )}

              {/* Active tasks list */}
              {activeTasks.length > 0 ? (
                <TaskList
                  tasks={activeTasks}
                  onEdit={openEditForm}
                  onDelete={handleDeleteTask}
                  onComplete={completeTask}
                  onClearDate={handleClearDate}
                />
              ) : !isAddFormVisible ? (
                allCompleted ? (
                  /* All tasks completed state */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-blue-500 mb-4" strokeWidth={1.5} />
                    <h3 className="text-base font-semibold text-gray-800 mb-1">All tasks completed</h3>
                    <p className="text-sm text-gray-500">Great job! There are no remaining tasks</p>
                  </div>
                ) : (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <EmptyTaskIcon />
                    <h3 className="text-base font-semibold text-gray-800 mb-1 mt-4">No tasks yet</h3>
                    <p className="text-sm text-gray-500">Add a task to start tracking your work</p>
                  </div>
                )
              ) : null}

              {/* Completed section */}
              {completedTasks.length > 0 && (
                <div className="mt-5 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors w-full"
                  >
                    <ChevronDown
                      className={cn('w-4 h-4 transition-transform duration-200', !isCompletedExpanded && '-rotate-90')}
                    />
                    Completed ({completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'})
                  </button>

                  {isCompletedExpanded && (
                    <div className="mt-2">
                      <TaskList tasks={completedTasks} onDelete={handleDeleteTask} isCompleted />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
