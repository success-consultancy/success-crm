import React from 'react';

import Image from 'next/image';
import { SuccessLogo } from '@/assets/images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCheck, ChevronDown, EditIcon } from 'lucide-react';
import { useGetBranchById, useGetBranches } from '@/query/get-branches';
import useAuthStore from '@/store/auth-store';
import { IUser } from '@/types/user-type';
import { queryClient } from '@/context/tanstack-context';
import { QUERY_KEYS } from '@/constants/query-keys';
import DialogWrapper from './dialog-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../atoms/button';
import { FormField, FormItem, FormLabel } from '../ui/form';
import Input from '../molecules/input';
import branchSchema, { BranchSchemaType } from '@/schema/branch-schema';
import { useAddBranch, useUpdateBranch } from '@/mutations/branch/add-branch';
import SelectField from './select-field';
import { TIMEZONES } from '@/constants/timezones';
import { PhoneNumberInput } from '../molecules/phone-number-input';
import { SUPER_ADMIN_ROLE } from '@/constants/global';
import { CountryDropdown } from './country-dropdown';
import toast from 'react-hot-toast';

const SidebarLogo = () => {
  const { data: branches, isLoading } = useGetBranches();
  const { setProfile, profile } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [branchId, setBranchId] = React.useState(profile?.branchId || '');

  const handleBranchSwitch = (item: any) => {
    setProfile({
      ...profile,
      branchId: item?.id,
    } as IUser);

    queryClient.resetQueries({
      queryKey: [QUERY_KEYS.GET_LEADS],
    });
  };

  const hasBranches = Array.isArray(branches) && branches.length > 0;

  const IS_SUPER_ADMIN = profile?.id === SUPER_ADMIN_ROLE;

  return (
    <div className="py-3 mb-4">
      {IS_SUPER_ADMIN ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <Image src={SuccessLogo.src} alt="logo" height={100} width={100} quality={70} className="h-12 w-auto" />

              <ChevronDown className="w-4 h-4" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {!hasBranches && <p> No Branches</p>}

            <DropdownMenuLabel className="text-neutral-light-grey">Switch branch</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {Array.isArray(branches) &&
              branches?.map((item) => {
                const selectedBranch = profile?.branchId === item?.id;
                return (
                  <div key={item.name} className="flex items-center justify-between gap-2 cursor-pointer">
                    <DropdownMenuItem
                      onClick={(e) => {
                        handleBranchSwitch(item);
                      }}
                      className="flex w-full items-center justify-between gap-2 cursor-pointer"
                    >
                      {item.name}
                      {selectedBranch && <CheckCheck size={20} />}
                    </DropdownMenuItem>
                    <EditIcon
                      size={20}
                      className="z-10"
                      onClick={(e) => {
                        setIsEditOpen(true);
                        setBranchId(item.id);
                      }}
                    />
                  </div>
                );
              })}
            <DropdownMenuItem
              onClick={() => handleBranchSwitch({ id: undefined })} // switch to all branches
              className="flex items-center justify-between gap-2"
            >
              All Branches
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
              className="flex items-center justify-between gap-2 text-b2-b text-primary-blue cursor-pointer"
            >
              Create new branch
            </DropdownMenuItem>

            {isEditOpen && (
              <DialogWrapper title="Edit branch" isOpen={isEditOpen} setIsOpen={setIsEditOpen} canClose={false}>
                <BranchDialog setIsOpen={setIsEditOpen} id={branchId} />
              </DialogWrapper>
            )}

            {isOpen && (
              <DialogWrapper title="Create new branch" isOpen={isOpen} setIsOpen={setIsOpen} canClose={false}>
                <BranchDialog setIsOpen={setIsOpen} />
              </DialogWrapper>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <Image src={SuccessLogo.src} alt="logo" height={100} width={100} quality={70} className="h-12 w-auto" />
        </div>
      )}
    </div>
  );
};

const BranchDialog = ({ setIsOpen, id }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; id?: string }) => {
  const { data: branch, isLoading } = useGetBranchById(id || '');

  const form = useForm<BranchSchemaType>({
    resolver: zodResolver(branchSchema),
    values: {
      name: branch?.name || '',
      country: branch?.country || '',
      city: branch?.city || '',
      timezone: branch?.timezone || '',
      phone: branch?.phone || '',
    },
  });

  const { mutate: addBranch, isPending } = useAddBranch();
  const { mutate: updateBranch, isPending: isUpdatePending } = useUpdateBranch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = form;

  const handleFormSubmit = (data: BranchSchemaType) => {
    if (id) {
      updateBranch(
        { ...data, id },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
          onError: (err: any) => {
            if (err?.response?.data?.errors) {
              Object.entries(err.response.data.errors).forEach(([key, value]) => {
                setError(key as keyof BranchSchemaType, { message: value as string });
              });
            }

            const message = err?.response?.data?.message || err?.message;
            toast.error(message || 'Failed to update branch');
          },
        },
      );
    } else {
      addBranch(data, {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (err: any) => {
          if (err?.response?.data?.errors) {
            Object.entries(err.response.data.errors).forEach(([key, value]) => {
              setError(key as keyof BranchSchemaType, { message: value as string });
            });
          }

          const message = err?.response?.data?.message || err?.message;
          toast.error(message || 'Failed to add branch');
        },
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <Input label={'Branch Name'} placeholder="e.g, Sydney branch" {...field} error={errors.name?.message} />
          )}
        />

        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <CountryDropdown
              label="Country"
              placeholder="Country"
              defaultValue={field.value}
              onChange={(country) => {
                field.onChange(country.alpha3);
              }}
            />
          )}
        />

        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <Input label={'City'} placeholder="Select city name" {...field} error={errors.city?.message} />
          )}
        />

        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <SelectField
              name="timezone"
              label="Timezone"
              control={control}
              options={TIMEZONES}
              placeholder="Select timezone"
            />
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneNumberInput
              {...field}
              label={'Phone'}
              placeholder="Enter phone number"
              error={errors.phone?.message}
            />
          )}
        />

        <div className="flex items-center gap-3 mt-3 justify-end">
          <Button onClick={() => setIsOpen(false)} variant={'secondary'}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(handleFormSubmit)} loading={isPending || isUpdatePending}>
            {id ? 'Update Branch' : 'Create Branch'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SidebarLogo;
