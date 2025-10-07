'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { DatePicker } from '../organisms/date-picker';
import TextInput from '../molecules/text-input';

const TaskForm = ({
  form,
  handleSubmit,
  saveTask,
  isEditMode,
  control,
  errors,
  closeTaskForm,
  handleBack,
}: {
  form: any;
  handleSubmit: any;
  saveTask: any;
  isEditMode: boolean;
  control: any;
  errors: any;
  closeTaskForm: any;
  handleBack: any;
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b ">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-xl font-semibold">{isEditMode ? 'Edit task' : 'New task'}</h2>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(saveTask)}>
          <div className="p-4 flex-1">
            <div className="mb-6">
              <FormField
                control={control}
                name="detail"
                defaultValue={isEditMode ? form.getValues('detail') : ''}
                render={({ field }) => <TextInput {...field} label="Task name" error={errors.detail?.message} />}
              />
            </div>
            <div className="mb-6">
              <FormField
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="date" className="">
                      Date
                    </Label>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select date"
                      className="h-12 text-b2 w-full"
                      disablePastDates={true}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="border-t p-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={closeTaskForm}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-400 hover:bg-blue-500">
              {isEditMode ? 'Save Changes' : 'Create task'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default TaskForm;
