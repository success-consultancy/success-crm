"use client";

import Container from "@/components/common/container";
import { Form, FormField } from "@/components/ui/form";
import leadFormSchema, { LeadSchemaType } from "@/schemas/lead-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Portal from "@/components/common/portal";
import { PortalIds } from "@/app/config/portal";
import Input from "@/components/common/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TinyEditor from "@/components/common/text-editor";
import { LeadsFormSteps } from "@/app/config/leads-form-steps";
import PersonalDetailsStep from "./_components/personal-details-fields";
import Button from "@/components/common/button";
import FormSteps from "@/components/common/form-steps";

type Props = {};

const page = (props: Props) => {
  return (
    <Container className="flex flex-col py-10 gap-8">
      <AddLeadForm />
    </Container>
  );
};

const AddLeadForm = () => {
  const form = useForm<LeadSchemaType>({
    resolver: zodResolver(leadFormSchema),
  });

  const {
    control,
    formState: { errors },
  } = form;

  const [currentStep, setCurrentStep] = useState(
    LeadsFormSteps.PersonalDetails
  );

  return (
    <Form {...form}>
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h4 text-content-heading font-bold">Leads</h3>
      </Portal>
      <FormSteps
        currentStep={currentStep}
        formSteps={Object.values(LeadsFormSteps)}
      />
      <div className="w-full bg-white-100 rounded-2xl flex flex-col gap-6 pb-5">
        <div className=" py-3 border-b border-b-stroke-divider flex items-center gap-2 px-6">
          <span className="text-h5 font-bold text-content-heading">
            {currentStep}
          </span>
        </div>
        <FormProvider {...form}>
          <form action="" className="flex flex-col gap-5 px-6">
            {currentStep === LeadsFormSteps.PersonalDetails && (
              <PersonalDetailsStep />
            )}
            {/* <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Country</Label>

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
                    selected={field.value as string}
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
                    selected={field.value as string}
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
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Visa</Label>

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
              name="expiryDate"
              render={({ field }) => (
                <div className=" flex flex-col gap-2 flex-1">
                  <Label className="text-b3-b font-semibold">
                    Visa Expiry Date
                  </Label>
                  <DatePicker
                    selected={field.value as string}
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
              name="serviceType"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">
                    Service Type
                  </Label>

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
              name="location"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Location</Label>

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
              name="source"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Source</Label>

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
          <div className="flex items-center gap-5">
            <FormField
              control={control}
              name="leadGenerator"
              render={({ field }) => (
                <Input
                  label={"Lead Generator"}
                  className="flex-1"
                  {...field}
                  error={errors.passportNo?.message}
                />
              )}
            />
            <FormField
              control={control}
              name="assignedTo"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Assigned to</Label>

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
              name="status"
              render={({ field }) => (
                <div className=" flex flex-col gap-1 flex-1">
                  <Label className="text-b3-b font-semibold">Status</Label>

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
          <div className="w-full" suppressHydrationWarning>
            <TinyEditor />
          </div> */}
            <div className="flex items-center self-end gap-3">
              <Button variant={"secondary"}>Cancel</Button>
              <Button>Next</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Form>
  );
};

export default page;

