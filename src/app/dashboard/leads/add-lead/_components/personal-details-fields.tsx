import React from "react";
import Input from "@/components/common/input";
import { FormField } from "@/components/ui/form";
import { LeadSchemaType } from "@/schemas/lead-schema";
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

const PersonalDetailsStep = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<LeadSchemaType>();
  return (
    <>
      <div className="flex items-center w-full gap-5">
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
              optionalText
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
          name="email"
          render={({ field }) => (
            <Input {...field} label="Email*" error={errors.email?.message} />
          )}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <Input {...field} label="Phone*" error={errors.phone?.message} />
          )}
        />
      </div>
      <div className="flex items-center gap-5 ">
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <div className=" flex flex-col gap-2 flex-1">
              <Label className="text-b3-b font-semibold">Birth Date</Label>
              <DatePicker
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                }}
              />
            </div>
          )}
        />
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              label={"Address"}
              className="flex-1"
              {...field}
              error={errors.address?.message}
              optionalText
            />
          )}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="occupation"
          render={({ field }) => (
            <div className=" flex flex-col gap-1 flex-1">
              <Label className="text-b3-b font-semibold">Occupation</Label>

              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="-Select-" className="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <FormField
          control={control}
          name="qualification"
          render={({ field }) => (
            <div className=" flex flex-col gap-1 flex-1">
              <Label className="text-b3-b font-semibold">Qualification</Label>

              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="-Select-" className="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default PersonalDetailsStep;

