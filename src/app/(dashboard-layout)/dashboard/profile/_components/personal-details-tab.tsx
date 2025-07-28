"use client";
import type React from "react";
import { useState, useRef } from "react";
import { FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Camera } from "lucide-react";
import { MeUser } from "@/query/get-me";
import { ProfileSchema, ProfileSchemaType } from "@/schema/profile-schema";
import { useUserUpdate } from "@/mutations/auth/profile-update";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Input from "@/components/molecules/input";
import Button from "@/components/atoms/button";

interface PersonalDetailsTabProps {
  user: MeUser | undefined;
}

const PersonalDetailsTab = ({ user }: PersonalDetailsTabProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      id: user?.id ? String(user.id) : "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      email: user?.email || "",
      role: user?.roleId ? String(user.roleId) : "",
      detail: user?.detail || "",
    },
    values: {
      id: user?.id ? String(user.id) : "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      email: user?.email || "",
      role: user?.roleId ? String(user.roleId) : "",
      detail: user?.detail || "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
  } = form;

  const { mutate: updateUser, isPending } = useUserUpdate();

  const onSubmit = (data: ProfileSchemaType) => {
    // Add the selected image to the form data if available
    const formData = {
      ...data,
      // profileImage: selectedImage,
    };
    updateUser(formData);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const name =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  return (
    <>
      <div className="flex gap-4 items-center mb-5">
        <div
          className="relative w-[88px] h-[88px] cursor-pointer group border rounded-full overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleAvatarClick}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Avatar container with consistent sizing */}
          <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full">
                <Avatar className="w-full h-full">
                  <AvatarImage src={selectedImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {name
                      .split(" ")
                      .map((n) => n.charAt(0).toUpperCase())
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Hover overlay - positioned absolutely within the rounded container */}
            <div
              className={`
                absolute inset-0 bg-black bg-opacity-50 rounded-full 
                flex flex-col items-center justify-center text-white text-sm
                transition-opacity duration-200
                ${isHovering ? "opacity-100" : "opacity-0"}
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

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <div className="flex items-start gap-5">
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

        <div className="flex items-start gap-5">
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
              <Input
                {...field}
                label="Address"
                error={errors.address?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start gap-5">
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
                readOnly
                value="Super Admin" // Display role name instead of ID
                error={errors.role?.message}
              />
            )}
          />
        </div>

        <FormField
          control={control}
          name="detail"
          render={({ field }) => (
            <>
              <Input
                {...field}
                type="textarea"
                label="Bio (optional)"
                error={errors.detail?.message}
              />
              <span className="mt-1 text-[#757575] text-[14px]">
                Brief description for your profile
              </span>
            </>
          )}
        />

        <Button
          type="submit"
          className="w-[143px] ml-auto btn btn-primary mt-4"
          disabled={!isValid || !isDirty || isPending}
          loading={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </>
  );
};

export default PersonalDetailsTab;
