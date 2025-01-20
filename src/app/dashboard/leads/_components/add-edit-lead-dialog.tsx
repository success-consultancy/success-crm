import Input from "@/components/common/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem } from "@/components/ui/form";
import leadFormSchema, { LeadSchemaType } from "@/schemas/lead-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";

type Props = {
  trigger: ReactNode;
};

const AddEditLeadDialog = (props: Props) => {
  const form = useForm<LeadSchemaType>({
    resolver: zodResolver(leadFormSchema),
  });

  const {
    control,
    formState: { errors },
  } = form;
  return (
    <Dialog>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent
        className="flex flex-col min-w-[60vw] items-center bg-bg-light-grey space-y-8 p-10 pb-20"
        hideCloseButton={true}
      >
        <DialogTitle className="text-h2">Add Lead</DialogTitle>
        <Form {...form}>
          <form action="" className="flex flex-col space-y-4 w-full">
            <div className="flex items-center gap-4">
              <FormItem className="flex-1">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Email Address*"
                      error={errors.email?.message}
                    />
                  )}
                />
              </FormItem>
              <FormItem className="flex-1">
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Phone Number*"
                      error={errors.phone?.message}
                    />
                  )}
                />
              </FormItem>
            </div>
            <div className="flex items-center gap-4">
              <FormItem className="flex-1">
                <FormField
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="First Name*"
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </FormItem>
              <FormItem className="flex-1">
                <FormField
                  control={control}
                  name="middleName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Middle Name"
                      error={errors.middleName?.message}
                    />
                  )}
                />
              </FormItem>
              <FormItem className="flex-1">
                <FormField
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Last Name*"
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </FormItem>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLeadDialog;

