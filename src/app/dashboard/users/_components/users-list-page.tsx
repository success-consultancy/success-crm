'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  EllipsisVertical,
  Pencil,
  Clock,
  Shield,
  Trash2,
  Download,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { useGetUsers } from '@/query/get-user';
import { useGetRoles } from '@/query/get-roles';
import { useDeleteUser } from '@/mutations/user/delete-user';
import { usePermissions } from '@/hooks/use-permissions';
import useAuthStore from '@/store/auth-store';
import { useExportUsers } from '@/mutations/user/export-users';
import { getAppointColorBasedOnUserName } from '@/utils/color';

type SortField = 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'isActive';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const ROLE_LABELS: Record<number, string> = {
  1: 'Super admin',
  2: 'Manager',
  3: 'General user',
  4: 'Accounting',
  5: 'Lead Management',
};

const UsersListPage = () => {
  const { create: canCreate, update: canUpdate, delete: canDelete } = usePermissions('users');
  const isAdmin = useAuthStore((s) => s.profile?.roleId === 1);
  const router = useRouter();
  const { data: users = [], isLoading } = useGetUsers();
  const { data: roles } = useGetRoles();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: exportUsers, isPending: isExporting } = useExportUsers();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      const role = (ROLE_LABELS[u.roleId] ?? '').toLowerCase();
      return name.includes(q) || role.includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'id') {
        aVal = a.id;
        bVal = b.id;
      } else if (sortField === 'firstName') {
        aVal = a.firstName;
        bVal = b.firstName;
      } else if (sortField === 'lastName') {
        aVal = a.lastName;
        bVal = b.lastName;
      } else if (sortField === 'email') {
        aVal = a.email;
        bVal = b.email;
      } else if (sortField === 'phone') {
        aVal = a.phone ?? '';
        bVal = b.phone ?? '';
      } else if (sortField === 'role') {
        aVal = a.roleId;
        bVal = b.roleId;
      } else if (sortField === 'isActive') {
        aVal = a.isActive ? 1 : 0;
        bVal = b.isActive ? 1 : 0;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDir]);

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageItems = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDir('asc');
      }
    },
    [sortField],
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 inline" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 ml-1 inline" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 ml-1 inline" />
    );
  };

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Users &amp; permissions</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full overflow-hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <Input
            placeholder="Search by user name or role"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-[18rem]"
          />
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/roles')}
              >
                Manage roles
              </Button>
            )}
            <Button
              variant="outline"
              LeftIcon={Download}
              onClick={() => exportUsers()}
              disabled={isExporting}
            >
              Export
            </Button>
            <Separator orientation="vertical" className="h-6" />
            {canCreate && (
              <Button LeftIcon={Plus} onClick={() => router.push('/dashboard/users/add')}>
                Add user
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-darkGrey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12 cursor-pointer select-none" onClick={() => handleSort('id')}>
                  ID <SortIcon field="id" />
                </th>
                <th className="min-w-[140px] cursor-pointer select-none" onClick={() => handleSort('firstName')}>
                  First name <SortIcon field="firstName" />
                </th>
                <th className="min-w-[140px] cursor-pointer select-none" onClick={() => handleSort('lastName')}>
                  Last name <SortIcon field="lastName" />
                </th>
                <th className="min-w-[200px] cursor-pointer select-none" onClick={() => handleSort('email')}>
                  Email <SortIcon field="email" />
                </th>
                <th className="min-w-[130px] cursor-pointer select-none" onClick={() => handleSort('phone')}>
                  Phone <SortIcon field="phone" />
                </th>
                <th className="min-w-[120px] cursor-pointer select-none" onClick={() => handleSort('role')}>
                  Role <SortIcon field="role" />
                </th>
                <th className="min-w-[100px] cursor-pointer select-none" onClick={() => handleSort('isActive')}>
                  Status <SortIcon field="isActive" />
                </th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(8)
                    .fill(null)
                    .map((_, i) => (
                      <tr key={i} className="border-b border-gray-50 *:px-3 *:py-2.5">
                        <td><Skeleton className="h-5 w-6" /></td>
                        <td><Skeleton className="h-5 w-24" /></td>
                        <td><Skeleton className="h-5 w-28" /></td>
                        <td><Skeleton className="h-5 w-44" /></td>
                        <td><Skeleton className="h-5 w-28" /></td>
                        <td><Skeleton className="h-5 w-20" /></td>
                        <td><Skeleton className="h-5 w-16" /></td>
                        <td><Skeleton className="h-5 w-8" /></td>
                      </tr>
                    ))
                : pageItems.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-darkGrey last:border-none"
                    >
                      <td className="text-sm">{user.id}</td>
                      <td className="font-medium">{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td className="truncate max-w-[220px]">{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {ROLE_LABELS[user.roleId] ?? `Role ${user.roleId}`}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open actions menu">
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-1" align="end">
                            <div className="flex flex-col">
                              {canUpdate && (
                                <Button
                                  variant="ghost"
                                  className="justify-start gap-2"
                                  onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit user
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                className="justify-start gap-2"
                                onClick={() => router.push(`/dashboard/users/${user.id}/timesheet`)}
                              >
                                <Clock className="h-4 w-4" />
                                View time sheet
                              </Button>
                              <Button
                                variant="ghost"
                                className="justify-start gap-2"
                                onClick={() => router.push('/dashboard/roles')}
                              >
                                <Shield className="h-4 w-4" />
                                Manage permissions
                              </Button>
                              {canDelete && (
                                <DeleteDialog
                                  trigger={
                                    <Button
                                      variant="ghost"
                                      className="justify-start gap-2 text-red-600 hover:text-red-700 w-full"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete user
                                    </Button>
                                  }
                                  title="Delete User"
                                  description="Are you sure you want to delete this user? This action cannot be undone."
                                  onConfirm={() => deleteUser(user.id)}
                                />
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))}

              {!isLoading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex w-full items-center justify-between pt-5 gap-5 mt-auto">
          <div className="text-sm flex items-center gap-2 text-neutral-darkGrey">
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Items per page</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-darkGrey">
            <span>
              {rangeStart} - {rangeEnd} of {totalItems}
            </span>
            <button
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              &#8249;
            </button>
            <button
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UsersListPage;
