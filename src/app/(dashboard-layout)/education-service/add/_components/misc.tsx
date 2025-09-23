'use client';

import { useFormContext } from 'react-hook-form';
import TextInput from '@/components/molecules/text-input';
import SelectField from '@/components/organisms/select-field';
import type { NewStudentType } from '@/schema/education-service/new-student.schema';
import { useEducationForm } from './education-form-provider';

const Misc = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useFormContext<NewStudentType>();
  const { submitForm } = useEducationForm();

  const onSubmit = (data: NewStudentType) => {
    submitForm(data);
  };

  return (
    <form id="education-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="px-6 py-4 font-bold text-xl border-b">Miscellaneous</div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          <SelectField
            control={control}
            name="assignedTo"
            label="Assigned To"
            options={[
              { label: 'John Doe', value: 'john-doe' },
              { label: 'Jane Smith', value: 'jane-smith' },
              { label: 'Mike Johnson', value: 'mike-johnson' },
              { label: 'Sarah Wilson', value: 'sarah-wilson' },
            ]}
            placeholder="Select assignee"
          />
          <SelectField
            control={control}
            name="source"
            label="Source"
            options={[
              { label: 'Website', value: 'website' },
              { label: 'Referral', value: 'referral' },
              { label: 'Social Media', value: 'social-media' },
              { label: 'Advertisement', value: 'advertisement' },
              { label: 'Walk-in', value: 'walk-in' },
            ]}
            placeholder="Select source"
          />
          <div className="col-span-2">
            <TextInput
              label="Additional Notes (Optional)"
              {...register('additionalNotes')}
              error={errors.additionalNotes?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Misc;
