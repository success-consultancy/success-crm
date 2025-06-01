
"use client";
import React, { useState } from "react";

import { FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordChangeSchema, PasswordChangeSchemaType, ProfileSchema, ProfileSchemaType } from "@/schemas/profile-schema";
import Input from "@/components/common/input";
import { useUserUpdate } from "@/mutations/user/user";
import Button from "@/components/common/button";
import Avatar from "react-avatar";

const PersonalDetailsTab = ({ user }: any) => {
  const form = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(PasswordChangeSchema)
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const { mutate: updateUser } = useUserUpdate();

  const onSubmit = (data: PasswordChangeSchemaType) => {
    //updateUser(data);
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >

        <FormField
          control={control}
          name="oldPassword"
          render={({ field }) => (
            <Input
              {...field}
              label="Old Password"
              error={errors.oldPassword?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="newPassword"
          render={({ field }) => (
            <Input {...field} label="New Password" error={errors.newPassword?.message} />
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <Input {...field} label="Confirm Password" error={errors.confirmPassword?.message} />
          )}
        />

        <Button
          type="submit"
          className="w-[143px] ml-auto btn btn-primary mt-4"
          disabled={Object.keys(errors).length > 0}
        >
          Save Changes
        </Button>
      </form>
    </>
  );
};

export default PersonalDetailsTab;
