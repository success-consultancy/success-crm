'use client';
import React, { useState } from 'react';

import { FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeSchemaType, PasswordChangeSchema } from '@/schemas/profile-schema';
import Input from '@/components/common/input';

const PasswordChangeTab = ({ user }: any) => {
  console.log(user);

  const form = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(PasswordChangeSchema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = form;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="oldPassword"
          render={({ field }) => <Input {...field} label="Old Password*" error={errors.oldPassword?.message} />}
        />
      </div>
    </div>
  );
};

export default PasswordChangeTab;
