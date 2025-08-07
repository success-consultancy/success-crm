'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { useGetTasks } from '@/query/get-tasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAuthStore from '@/store/auth-store';
import { useGetUsers } from '@/query/get-user';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import taskFormSchema, { TaskSchemaType } from '@/schema/task-schema';
import { useAddTask, useEditTask } from '@/mutations/task/add-task';
import TaskHeader from './task-header';
import TaskFilter from './task-filter';
import TaskForm from './task-form';
import TaskList from './task-list';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskStatus, TaskType } from '@/constants/task-constants';
import TaskIcon from '@/assets/icons/task-icon';
import EmptyTaskIcon from '@/assets/icons/empty-task-icon';

interface Task {
  id: string;
  title: string;
  type: string;
  status: string;
}
type TaskFormState = {
  isOpen: boolean;
  isAddMode: boolean;
  isEditMode: boolean;
  currentTaskId: number | null;
};

export function TasksDrawer() {
  const { profile } = useAuthStore();

  const [taskFormState, setTaskFormState] = useState<TaskFormState>({
    isOpen: false,
    isAddMode: false,
    isEditMode: false,
    currentTaskId: null,
  });
  const [taskFilter, setTaskFilter] = useState({
    type: TaskType.MyTask,
    status: TaskStatus.Upcoming,
    selectedEmployee: profile?.id,
  });

  const form = useForm<TaskSchemaType>({
    resolver: zodResolver(taskFormSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const superAdmin = profile?.roleId === 1;
  const { data: tasks } = useGetTasks({
    userId: Number(taskFilter.selectedEmployee),
    status: taskFilter.status.toLowerCase(),
  });
  const { data: users } = useGetUsers();
  const addTask = useAddTask();
  const editTask = useEditTask();

  useEffect(() => {
    if (taskFilter.type === TaskType.MyTask) {
      setTaskFilter({
        ...taskFilter,
        selectedEmployee: profile?.id,
      });
    }
  }, [taskFilter.type]);

  useEffect(() => {
    if (profile) {
      setTaskFilter({
        ...taskFilter,
        selectedEmployee: profile.id,
      });
    }
  }, [profile]);

  const saveTask = (data: TaskSchemaType) => {
    if (taskFormState.isEditMode) {
      editTask.mutateAsync({
        ...data,
        id: taskFormState.currentTaskId as number,
      });
    } else {
      addTask.mutateAsync({
        ...data,
        userId: Number(profile?.id),
      });
    }
  };
  const openAddTaskForm = () => {
    setTaskFormState({
      isOpen: true,
      isAddMode: true,
      isEditMode: false,
      currentTaskId: null,
    });
  };

  const handleBack = () => {
    setTaskFormState({
      isOpen: true,
      isAddMode: false,
      isEditMode: false,
      currentTaskId: null,
    });
  };

  const openModelTaskForm = () => {
    setTaskFormState({
      isOpen: true,
      isAddMode: false,
      isEditMode: false,
      currentTaskId: null,
    });
  };

  const closeTaskForm = () => {
    setTaskFormState({
      isOpen: false,
      isAddMode: false,
      isEditMode: false,
      currentTaskId: null,
    });
  };
  const openEditTaskForm = (taskId: number) => {
    const taskToEdit: TaskSchemaType | undefined = tasks?.find((task: TaskSchemaType) => task.id === taskId);
    if (taskToEdit) {
      setTaskFormState({
        isOpen: true,
        isAddMode: true,
        isEditMode: true,
        currentTaskId: taskId,
      });
      form.reset(taskToEdit);
    }
  };
  return (
    <>
      <div className="cursor-pointer" onClick={() => openModelTaskForm()}>
        <TaskIcon />
      </div>
      <Sheet open={taskFormState.isOpen} onOpenChange={closeTaskForm}>
        <SheetContent side="right" className="min-w-[688px] sm:max-w-md border-l bg-white ">
          {!taskFormState.isAddMode ? (
            <>
              <TaskHeader />
              <TaskFilter
                taskType={taskFilter.type}
                setTaskType={(value: string) => setTaskFilter({ ...taskFilter, type: value as TaskType })}
                taskStatus={taskFilter.status}
                setTaskStatus={(value: string) => setTaskFilter({ ...taskFilter, status: value as TaskStatus })}
                superAdmin={superAdmin}
                openAddTaskForm={openAddTaskForm}
              />
              {taskFilter.type === TaskType.EmployeeTask && (
                <div className="border-b">
                  <Tabs
                    value={String(taskFilter.selectedEmployee)}
                    onValueChange={(value) =>
                      setTaskFilter({
                        ...taskFilter,
                        selectedEmployee: Number(value),
                      })
                    }
                    className="w-full"
                  >
                    <TabsList className="w-full h-auto flex overflow-x-auto bg-transparent justify-start px-4 py-0 hide-scrollbar">
                      {users &&
                        users.map((employee) => (
                          <TabsTrigger
                            key={employee.id}
                            value={String(employee.id)}
                            className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none"
                          >
                            {employee.firstName + ' ' + employee.lastName}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                  </Tabs>
                </div>
              )}
              <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b">{taskFilter.status + ' tasks'}</div>

              {tasks?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center h-[calc(100vh-200px)]">
                  <div className="mb-4">
                    <EmptyTaskIcon />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
                  <p className="text-sm text-muted-foreground">Add a task to start tracking your work</p>
                </div>
              ) : (
                <ScrollArea className="h-full w-full" type="hover">
                  <TaskList tasks={tasks} openEditTaskForm={openEditTaskForm} />
                </ScrollArea>
              )}
            </>
          ) : (
            <>
              <TaskForm
                form={form}
                handleSubmit={handleSubmit}
                saveTask={saveTask}
                isEditMode={taskFormState.isEditMode}
                control={control}
                errors={errors}
                closeTaskForm={closeTaskForm}
                handleBack={handleBack}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
