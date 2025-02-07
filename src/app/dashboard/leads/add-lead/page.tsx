"use client";

import Container from "@/components/common/container";
import DatePicker from "@/components/common/date-picker";
import FormFieldGroup from "@/components/common/form-field-group";
import Input from "@/components/common/input";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField } from "@/components/ui/form";
import leadFormSchema, { LeadSchemaType } from "@/schemas/lead-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import PersonalDetailsFields from "./_components/personal-details-fields";
import ContactDetailsFields from "./_components/contact-details-fields";

type Props = {};

const page = (props: Props) => {
  return (
    <Container className="flex flex-col py-10 gap-8">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-h3 text-content-heading">Add Lead</h3>
      </div>
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

  return (
    <Form {...form}>
      <form action="" className="flex flex-col gap-4">
        <PersonalDetailsFields control={control} errors={errors} />
        <ContactDetailsFields control={control} errors={errors} />
      </form>
    </Form>
  );
};

export default page;

