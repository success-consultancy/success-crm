import React from 'react';

import Image from 'next/image';
import { SuccessLogo } from '@/assets/images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCheck, ChevronDown } from 'lucide-react';
import { useGetBranches } from '@/query/get-branches';
import useAuthStore from '@/store/auth-store';
import { IUser } from '@/types/user-type';
import { queryClient } from '@/context/tanstack-context';
import { QUERY_KEYS } from '@/constants/query-keys';

const SidebarLogo = () => {
  const { data: branches, isLoading } = useGetBranches();
  const { setProfile, profile } = useAuthStore();

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

export default SidebarLogo;
