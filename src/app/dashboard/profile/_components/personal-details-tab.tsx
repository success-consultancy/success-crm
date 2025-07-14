'use client';
import type React from 'react';
import { useState, useRef } from 'react';
import { FormField } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema, type ProfileSchemaType } from '@/schemas/profile-schema';
import Input from '@/components/common/input';
import { useUserUpdate } from '@/mutations/auth/login';
import Button from '@/components/common/button';
import Avatar from 'react-avatar';
import { Camera } from 'lucide-react';

const PersonalDetailsTab = ({ user }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(user?.profileImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      id: String(user?.id) || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      email: user?.email || '',
      role: '',
      bio: user?.detail || '',
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const name = user?.firstName + ' ' + user?.lastName;

  return (
    <>
      <div className="flex gap-4 items-center mb-5">
        <div
          className="relative w-[88px] h-[88px] cursor-pointer group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleAvatarClick}
        >
          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

          {/* Avatar container with consistent sizing */}
          <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden">
            {selectedImage ? (
              <img src={selectedImage || '/placeholder.svg'} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full">
                <Avatar name={name} round size="88" className="w-full h-full text-[24px]" />
              </div>
            )}

            {/* Hover overlay - positioned absolutely within the rounded container */}
            <div
              className={`
                absolute inset-0 bg-black bg-opacity-50 rounded-full 
                flex flex-col items-center justify-center text-white text-sm
                transition-opacity duration-200
                ${isHovering ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs">Add Image</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-bu-l mb-1">{name}</h1>
          <span className="text-c1">Super admin</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex items-start gap-5">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => <Input {...field} label="First Name" error={errors.firstName?.message} />}
          />
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => <Input {...field} label="Last Name" error={errors.lastName?.message} />}
          />
        </div>

        <div className="flex items-start gap-5">
          <FormField
            control={control}
            name="phone"
            render={({ field }) => <Input {...field} label="Phone number" error={errors.phone?.message} />}
          />
          <FormField
            control={control}
            name="address"
            render={({ field }) => <Input {...field} label="Address" error={errors.address?.message} />}
          />
        </div>

        <div className="flex items-start gap-5">
          <FormField
            control={control}
            name="email"
            render={({ field }) => <Input {...field} label="Email*" error={errors.email?.message} />}
          />
          <FormField
            control={control}
            name="role"
            render={({ field }) => <Input {...field} label="Role" disabled error={errors.role?.message} />}
          />
        </div>

        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <>
              <Input {...field} type="textarea" label="Bio (optional)" error={errors.bio?.message} />
              <span className="mt-1 text-[#757575] text-[14px]">Brief description for your profile</span>
            </>
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
