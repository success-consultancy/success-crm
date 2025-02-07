import React from "react";
import { cn } from "@/lib/cn";
import Input from "@/components/common/input";
import { FormField } from "@/components/ui/form";
import { LeadSchemaType } from "@/schemas/lead-schema";
import { Control, FieldErrors } from "react-hook-form";
import DatePicker from "@/components/common/date-picker";
import FormFieldGroup from "@/components/common/form-field-group";

type Props = {
  control: Control<LeadSchemaType>;
  errors: FieldErrors<LeadSchemaType>;
  className?: string;
};

const PersonalDetailsFields = ({ control, errors, className }: Props) => {
  return (
    <FormFieldGroup title="Personal Details" className={cn(["", className])}>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <Input
              label={"First Name*"}
              {...field}
              error={errors.firstName?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="middleName"
          render={({ field }) => (
            <Input
              label={"Middle Name"}
              {...field}
              error={errors.middleName?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <Input
              label={"Last Name*"}
              {...field}
              error={errors.lastName?.message}
            />
          )}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <DatePicker
              label="Date of Birth"
              className="w-full"
              mode="single"
              onSelect={(date) => {
                if (!date) return;
                field.onChange(date.toISOString());
              }}
              selected={field.value ? new Date(field.value) : undefined}
              error={errors.dateOfBirth?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              label={"Address"}
              {...field}
              error={errors.address?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <Input
              label={"Country"}
              {...field}
              error={errors.country?.message}
            />
          )}
        />
      </div>
    </FormFieldGroup>
  );
};

export default PersonalDetailsFields;

