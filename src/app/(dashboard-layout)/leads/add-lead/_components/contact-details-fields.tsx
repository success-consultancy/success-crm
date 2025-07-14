
import FormFieldGroup from '@/components/atoms/form-field-group';
import Input from '@/components/molecules/input';
import { FormField } from '@/components/ui/form';
import { LeadSchemaType } from '@/schema/lead-schema';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';

type Props = {
  control: Control<LeadSchemaType>;
  errors: FieldErrors<LeadSchemaType>;
  className?: string;
};

const ContactDetailsFields = ({ control, errors, ...props }: Props) => {
  return (
    <FormFieldGroup className={props.className} title="Contact Details">
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="email"
          render={({ field }) => <Input {...field} label="Email*" error={errors.email?.message} />}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => <Input {...field} label="Phone*" error={errors.phone?.message} />}
        />
      </div>
    </FormFieldGroup>
  );
};

export default ContactDetailsFields;
