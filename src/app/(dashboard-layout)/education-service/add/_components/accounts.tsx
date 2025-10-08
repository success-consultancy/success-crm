'use client';

import { Controller, useFormContext } from 'react-hook-form';
import TextInput from '@/components/molecules/text-input';
import SelectField from '@/components/organisms/select-field';
import type { NewStudentType } from '@/schema/education-service/new-student.schema';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/organisms/date-picker';
import FormErrorMessage from '@/components/atoms/form-error-message';

const Accounts = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NewStudentType>();

  return (
    <div>
      <div className="px-6 py-4 font-bold text-xl border-b">Accounts</div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          <SelectField
            control={control}
            name="accountPaymentPlan"
            label="Account Payment Plan"
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Annually', value: 'annually' },
              { label: 'One-time', value: 'one-time' },
            ]}
            placeholder="Select payment plan"
          />
          <TextInput
            label="Commission"
            type="number"
            {...register('commission', { valueAsNumber: true })}
            error={errors.commission?.message}
          />
          <TextInput
            label="Account Amount"
            type="number"
            {...register('accountAmount', { valueAsNumber: true })}
            error={errors.accountAmount?.message}
          />
          <TextInput
            label="Discount (Optional)"
            type="number"
            {...register('discount', { valueAsNumber: true })}
            error={errors.discount?.message}
          />
          <TextInput
            label="Bonus (Optional)"
            type="number"
            {...register('bonus', { valueAsNumber: true })}
            error={errors.bonus?.message}
          />
          <TextInput
            label="Net Amount"
            type="number"
            {...register('netAmount', { valueAsNumber: true })}
            error={errors.netAmount?.message}
          />

          <div className="space-y-2">
            <Label className="text-b2" htmlFor="accountDueDate">
              Account Due Date
            </Label>
            <Controller
              name="accountDueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  side="top"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pick a date"
                  className="h-12 text-b2 w-full"
                  disablePastDates={true}
                  error={!!errors.accountDueDate?.message}
                />
              )}
            />
            <FormErrorMessage message={errors.accountDueDate?.message} />
          </div>
          <TextInput
            label="Account Invoice Number"
            {...register('accountInvoiceNumber')}
            error={errors.accountInvoiceNumber?.message}
          />
          <SelectField
            control={control}
            name="commissionStatus"
            label="Commission Status"
            options={[
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
              { label: 'Processing', value: 'processing' },
              { label: 'Cancelled', value: 'cancelled' },
            ]}
            placeholder="Select commission status"
          />
        </div>
        <div className="mt-5">
          <TextInput
            label="Account Notes (Optional)"
            {...register('accountNotes')}
            error={errors.accountNotes?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default Accounts;
