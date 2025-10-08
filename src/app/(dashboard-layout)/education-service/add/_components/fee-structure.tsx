'use client';

import { Controller, useFormContext } from 'react-hook-form';
import TextInput from '@/components/molecules/text-input';
import SelectField from '@/components/organisms/select-field';
import type { NewStudentType } from '@/schema/education-service/new-student.schema';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';
import { Editor } from '@tinymce/tinymce-react';

const FeeStructure = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<NewStudentType>();
  const feeNotes = watch('feeNotes');
  const handleEditorChange = (content: string) => {
    setValue('feeNotes', content, { shouldValidate: true });
  };

  return (
    <div>
      <div className="px-6 py-4 font-bold text-xl border-b">Fee Structure</div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          <SelectField
            control={control}
            name="feePaymentPlan"
            label="Fee Payment Plan"
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annually', value: 'annually' },
              { label: 'One-time', value: 'one-time' },
            ]}
            placeholder="Select payment plan"
          />
          <TextInput
            label="Fee Amount"
            type="number"
            {...register('feeAmount', { valueAsNumber: true })}
            error={errors.feeAmount?.message}
          />

          <div className="space-y-2">
            <Label className="text-b2" htmlFor="dueDate">
              Payment Due Date
            </Label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  side="top"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick a date"
                  className="h-12 text-b2 w-full"
                  disablePastDates={true}
                  error={!!errors.dueDate?.message}
                />
              )}
            />
            <FormErrorMessage message={errors.dueDate?.message} />
          </div>
          <TextInput label="Invoice Number" {...register('invoiceNumber')} error={errors.invoiceNumber?.message} />
          <SelectField
            control={control}
            name="paymentStatus"
            label="Payment Status"
            options={[
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
              { label: 'Overdue', value: 'overdue' },
              { label: 'Cancelled', value: 'cancelled' },
            ]}
            placeholder="Select payment status"
          />
        </div>
        <div className="mt-6">
          <Label className="text-b2 mb-2" htmlFor="feeNotes">
            Fee Notes
          </Label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
            value={feeNotes}
            onEditorChange={handleEditorChange}
            init={{
              height: 300,
              menubar: false,
              toolbar:
                'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent',
              promotion: false,
              branding: false,
            }}
          />
          {errors.feeNotes && <FormErrorMessage message={errors.feeNotes.message} />}
        </div>
      </div>
    </div>
  );
};

export default FeeStructure;
