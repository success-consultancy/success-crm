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
import { CheckCheck, ChevronDown } from 'lucide-react';
import { useGetBranches } from '@/query/get-branches';
import useAuthStore from '@/store/auth-store';
import { IUser } from '@/types/user-type';
import { queryClient } from '@/context/tanstack-context';
import { QUERY_KEYS } from '@/constants/query-keys';
import DialogWrapper from './dialog-wrapper';
import TextInput from '../molecules/text-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../atoms/button';
import { FormField } from '../ui/form';
import Input from '../molecules/input';
import branchSchema, { BranchSchemaType } from '@/schema/branch-schema';
import { useAddBranch } from '@/mutations/branch/add-branch';
import SelectField from './select-field';
import { TIMEZONES } from '@/constants/timezones';

const SidebarLogo = () => {
  const { data: branches, isLoading } = useGetBranches();
  const { setProfile, profile } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleItemClick = (item: any) => {
    setProfile({
      ...profile,
      branchId: item?.id,
    } as IUser);

    queryClient.resetQueries({
      queryKey: [QUERY_KEYS.GET_LEADS],
    });
  };

  const hasBranches = Array.isArray(branches) && branches.length > 0;

  const SUPER_ADMIN = profile?.id === 1;

  return (
    <div className="py-3 mb-4">
      {SUPER_ADMIN ? (
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
                  <React.Fragment key={item.name}>
                    <DropdownMenuItem
                      onClick={() => handleItemClick(item)}
                      className="flex items-center justify-between gap-2"
                    >
                      {item.name}
                      {selectedBranch && <CheckCheck size={20} />}
                    </DropdownMenuItem>
                  </React.Fragment>
                );
              })}
            <DropdownMenuItem
              onClick={() => handleItemClick({ id: undefined })}
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

            <DialogWrapper title="Create new branch" isOpen={isOpen} setIsOpen={setIsOpen} canClose={false}>
              <CreateBranchDialog setIsOpen={setIsOpen} />
            </DialogWrapper>
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

// Branch name, country, city, timezone, phone number input
const CreateBranchDialog = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const form = useForm<BranchSchemaType>({
    resolver: zodResolver(branchSchema),
    // defaultValues,
  });

  const { mutate: addBranch, isPending } = useAddBranch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = form;

  const handleFormSubmit = (data: BranchSchemaType) => {
    addBranch(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

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
            <Input
              label={'Country'}
              placeholder="Select a country"
              {...field}
              // error={errors.country?.message}
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

        {/* replace timezone with select timezone */}

        {/* <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <Input label={'Timezone'} placeholder="Select timezone" {...field} error={errors.timezone?.message} />
          )}
        /> */}
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
              // error={errors.timezone?.message}
            />
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <Input label={'Phone'} placeholder="Enter phone number" {...field} error={errors.phone?.message} />
          )}
        />

        <div className="flex items-center gap-3 mt-3 justify-end">
          <Button onClick={() => setIsOpen(false)} variant={'secondary'}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(handleFormSubmit)} loading={isPending}>
            Create Branch
          </Button>
        </div>
      </div>
    </>
  );
};

export default SidebarLogo;
