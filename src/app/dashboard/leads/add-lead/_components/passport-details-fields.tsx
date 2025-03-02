import React from "react";
import Input from "@/components/common/input";
import { FormField } from "@/components/ui/form";
import { LeadSchemaType } from "@/schemas/lead-schema";
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/date-picker";
import SelectCommon from "@/components/common/select-common";

const PassportDetailsStep = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<LeadSchemaType>();

  setValue("hasVisitedStep", true);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Country"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="passportNo"
          render={({ field }) => (
            <Input
              label={"Passport number"}
              className="flex-1"
              {...field}
              error={errors.passportNo?.message}
            />
          )}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="issueDate"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Issue Date</Label>
              <DatePicker
                mode="single"
                selected={!!field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date);
                }}
              />
            </div>
          )}
        />
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Expiry Date</Label>
              <DatePicker
                mode="single"
                selected={!!field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date);
                }}
              />
            </div>
          )}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="visa"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Visa"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">
                Visa Expiry Date
              </Label>
              <DatePicker
                mode="single"
                selected={!!field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date);
                }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default PassportDetailsStep;

