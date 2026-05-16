'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUsers } from '@/query/get-user';
import { getAppointColorBasedOnUserName } from '@/utils/color';

type SortField = 'name' | 'email' | 'role' | 'isActive';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const ROLES: Record<number, string> = {
  1: 'Admin',
  2: 'Manager',
  3: 'Consultant',
};

const UsersListPage = () => {
  const router = useRouter();
  const { data: users = [], isLoading } = useGetUsers();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      return name.includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    });
  }, [users, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'name') {
        aVal = `${a.firstName} ${a.lastName}`;
        bVal = `${b.firstName} ${b.lastName}`;
      } else if (sortField === 'email') {
        aVal = a.email;
        bVal = b.email;
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
        <h3 className="text-h5 text-content-heading font-bold">Users</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full overflow-hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <Input
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-[18rem]"
          />
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button LeftIcon={Plus} onClick={() => router.push('/dashboard/users/add')}>
              Add user
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-darkGrey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th className="min-w-[180px] cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Name <SortIcon field="name" />
                </th>
                <th className="min-w-[200px] cursor-pointer select-none" onClick={() => handleSort('email')}>
                  Email <SortIcon field="email" />
                </th>
                <th className="min-w-[130px]">Phone</th>
                <th className="min-w-[120px] cursor-pointer select-none" onClick={() => handleSort('role')}>
                  Role <SortIcon field="role" />
                </th>
                <th className="min-w-[100px] cursor-pointer select-none" onClick={() => handleSort('isActive')}>
                  Status <SortIcon field="isActive" />
                </th>
                <th className="w-16 text-right" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(8)
                  .fill(null)
                  .map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 *:px-3 *:py-2.5">
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-36" /></td>
                      <td><Skeleton className="h-5 w-44" /></td>
                      <td><Skeleton className="h-5 w-28" /></td>
                      <td><Skeleton className="h-5 w-20" /></td>
                      <td><Skeleton className="h-5 w-16" /></td>
                      <td><Skeleton className="h-5 w-8" /></td>
                    </tr>
                  ))
                : pageItems.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-darkGrey last:border-none"
                  >
                    <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex-shrink-0 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: (user as any).color ||
                              getAppointColorBasedOnUserName(user.firstName, user.lastName, 'raw') as string,
                          }}
                        />
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="truncate max-w-[220px]">{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {ROLES[user.roleId] ?? `Role ${user.roleId}`}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                        aria-label="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {!isLoading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
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
              onValueChange={(val) => { setPageSize(Number(val)); setPage(1); }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Items per page</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-darkGrey">
            <span>{rangeStart} - {rangeEnd} of {totalItems}</span>
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
