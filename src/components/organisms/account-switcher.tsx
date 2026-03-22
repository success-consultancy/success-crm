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
import { Check, ChevronsUpDown, Pencil, Plus, Building2 } from 'lucide-react';
import { useGetBranchById, useGetBranches } from '@/query/get-branches';
import useAuthStore from '@/store/auth-store';
import { IUser } from '@/types/user-type';
import { queryClient } from '@/context/tanstack-context';
import { QUERY_KEYS } from '@/constants/query-keys';
import DialogWrapper from './dialog-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../atoms/button';
import { FormField } from '../ui/form';
import Input from '../molecules/input';
import branchSchema, { BranchSchemaType } from '@/schema/branch-schema';
import { useAddBranch, useUpdateBranch } from '@/mutations/branch/add-branch';
import TimezoneSelect from './timezone-select';
import { PhoneNumberInput } from '../molecules/phone-number-input';
import { SUPER_ADMIN_ROLE } from '@/constants/global';
import { CountryDropdown } from './country-dropdown';
import toast from 'react-hot-toast';
import { useSidebarStore } from '@/store/sidebar-store';
import SectionLoader from '@/components/molecules/section-loader';

// Logo Component
const SidebarLogo = () => {
  const { isCollapsed } = useSidebarStore();

  if (isCollapsed) {
    return (
      <div className="border-b border-gray-100 p-4 flex items-center justify-center">
        <Image
          src={'/success-logo-mini.png'}
          alt="logo"
          height={40}
          width={40}
          quality={70}
          className="h-10 w-auto"
        />
      </div>
    );
  }

  return (
    <div className="border-b border-gray-100 pl-5 py-3">
      <div className="flex items-center ">
        <Image
          src={SuccessLogo.src}
          alt="logo"
          height={40}
          width={132}
          quality={70}
          className="h-10 w-auto object-contain"
        />
      </div>
    </div>
  );
};

// Branch Selector Component
const BranchSelector = () => {
  const { data: branches, isLoading } = useGetBranches();
  const { setProfile, profile } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
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

  const currentBranch = branches?.find((item) => item.id === profile?.branchId);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getBranchInitial = (branchName: string) => {
    return capitalizeFirstLetter(branchName || 'C').charAt(0);
  };

  if (isCollapsed) {
    return null;
  }

  if (!IS_SUPER_ADMIN) {
    return null;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer select-none hover:bg-gray-50 rounded-lg px-2 py-2 transition-colors w-full">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-neutral-darkGrey">
                {currentBranch ? getBranchInitial(currentBranch.name) : 'A'}
              </span>
            </div>
            <span className="flex-1 text-sm font-medium text-neutral-darkGrey">
              {currentBranch ? capitalizeFirstLetter(currentBranch.name) : 'All Branches'}
            </span>
            <ChevronsUpDown className="w-4 h-4 text-neutral-darkGrey shrink-0" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Switch branch
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {!hasBranches && (
            <p className="px-2 py-1.5 text-sm text-gray-400 text-center">No branches available</p>
          )}

          {Array.isArray(branches) &&
            branches.map((item) => {
              const isSelected = profile?.branchId === item?.id;
              return (
                <div key={item.id} className="flex items-center gap-1 px-1">
                  <DropdownMenuItem
                    onClick={() => handleBranchSwitch(item)}
                    className="flex-1 flex items-center gap-2 cursor-pointer rounded-md"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600">
                        {getBranchInitial(item.name)}
                      </span>
                    </div>
                    <span className="flex-1 text-sm truncate">{capitalizeFirstLetter(item.name)}</span>
                    {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                  </DropdownMenuItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditOpen(true);
                      setBranchId(item.id);
                    }}
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              );
            })}

          <DropdownMenuItem
            onClick={() => handleBranchSwitch({ id: undefined })}
            className="flex items-center gap-2 cursor-pointer mx-1 rounded-md"
          >
            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
              <Building2 size={12} className="text-gray-500" />
            </div>
            <span className="flex-1 text-sm">All Branches</span>
            {!profile?.branchId && <Check size={14} className="text-blue-600 shrink-0" />}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            className="flex items-center gap-2 text-primary-blue cursor-pointer font-medium mx-1 rounded-md"
          >
            <Plus size={14} />
            Create new branch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    return <SectionLoader minHeight="200px" />;
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
            <TimezoneSelect name="timezone" label="Timezone" control={control} placeholder="Select timezone" />
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

export { SidebarLogo, BranchSelector };
export default SidebarLogo;
