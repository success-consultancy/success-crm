"use client";
import React, { useState } from "react";

import { FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, ProfileSchemaType } from "@/schemas/profile-schema";
import Input from "@/components/common/input";
import { useUserUpdate } from "@/mutations/user/user";

const PersonalDetailsTab = ({ user }: any) => {
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      id: String(user?.id) || "",
      firstName: user?.firstName!,
      lastName: user?.lastName!,
      phone: user?.phone!,
      address: user?.address!,
      email: user?.email!,
      role: "",
      bio: user?.detail || "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const { mutate: updateUser } = useUserUpdate();

  const onSubmit = (data: ProfileSchemaType) => {
    updateUser(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <Input {...field} label="ID" disabled error={errors.id?.message} />
          )}
        />
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <Input
              {...field}
              label="First Name"
              error={errors.firstName?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <Input
              {...field}
              label="Last Name"
              error={errors.lastName?.message}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              {...field}
              label="Phone number"
              error={errors.phone?.message}
            />
          )}
        />
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <Input {...field} label="Address" error={errors.address?.message} />
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
          name="role"
          render={({ field }) => (
            <Input
              {...field}
              label="Role"
              disabled
              error={errors.role?.message}
            />
          )}
        />
      </div>
      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <Input
            {...field}
            label="Bio (optional)"
            error={errors.bio?.message}
          />
        )}
      />

      <button
        type="submit"
        className="btn btn-primary mt-4"
        disabled={Object.keys(errors).length > 0}
      >
        Save
      </button>
    </form>
  );
};

export default PersonalDetailsTab;
