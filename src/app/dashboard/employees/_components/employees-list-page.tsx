'use client';

import { useState, useMemo, useCallback } from 'react';
import { Clock, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { Separator } from '@/components/ui/separator';
import SearchInput from '@/components/molecules/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableSkeleton from '@/components/organisms/table-skeleton';
import TableEmptyRow from '@/components/common/table-empty-row';
import { Badge } from '@/components/ui/badge';
import { useGetUsers } from '@/query/get-user';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import { downloadFile } from '@/utils/download';

type SortField = 'name' | 'email' | 'role' | 'isActive';
type SortDir = 'asc' | 'desc';
type RoleFilter = 'all' | '1' | '2' | '3' | '4' | '5';
type StatusFilter = 'all' | 'active' | 'inactive';

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const ROLES: Record<number, string> = {
  1: 'Super Admin',
  2: 'Manager',
  3: 'General user',
  4: 'Accountant',
  5: 'Lead management',
};

const EmployeesListPage = () => {
  const router = useRouter();
  const { data: users = [], isLoading } = useGetUsers({ includeInactive: true });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchSearch =
        !q || name.includes(q) || (u.email ?? '').toLowerCase().includes(q) || (u.phone ?? '').includes(q);
      const matchRole = roleFilter === 'all' || String(u.roleId) === roleFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.isActive) ||
        (statusFilter === 'inactive' && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'name') {
        aVal = `${a.firstName} ${a.lastName}`;
        bVal = `${b.firstName} ${b.lastName}`;
      } else if (sortField === 'email') {
        aVal = a.email ?? '';
        bVal = b.email ?? '';
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

  const handleExport = useCallback(() => {
    const headers = ['ID', 'First name', 'Last name', 'Email', 'Phone', 'Role', 'Status', 'Joined'];
    const rows = users.map((u) => [
      u.id,
      u.firstName,
      u.lastName,
      u.email,
      u.phone,
      ROLES[u.roleId] ?? u.roleId,
      u.isActive ? 'Active' : 'Inactive',
      u.createdAt ? format(new Date(u.createdAt), 'dd/MM/yyyy') : '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'employees.csv', 'text/csv;charset=utf-8;');
  }, [users]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Employees</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full min-h-0 overflow-hidden">
        <div className="flex w-full items-center justify-between pb-3 gap-5 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Select
              value={roleFilter}
              onValueChange={(v) => {
                setRoleFilter(v as RoleFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {Object.entries(ROLES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-dark-grey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th className="min-w-[200px] cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Employee name <SortIcon field="name" />
                </th>
                <th className="min-w-[220px] cursor-pointer select-none" onClick={() => handleSort('email')}>
                  Email <SortIcon field="email" />
                </th>
                <th className="min-w-[140px]">Phone</th>
                <th className="min-w-[140px] cursor-pointer select-none" onClick={() => handleSort('role')}>
                  Role <SortIcon field="role" />
                </th>
                <th className="min-w-[100px] cursor-pointer select-none" onClick={() => handleSort('isActive')}>
                  Status <SortIcon field="isActive" />
                </th>
                <th className="w-16 text-right" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton columns={6} rows={pageSize} />
              ) : (
                pageItems.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-dark-grey last:border-none"
                  >
                    <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex-shrink-0 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getAppointColorBasedOnUserName(user as any, 'raw') as string,
                          }}
                        />
                        <span className="font-medium text-neutral-black">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="truncate max-w-[260px]">{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Badge variant="secondary" className="font-normal">
                        {ROLES[user.roleId] ?? `Role ${user.roleId}`}
                      </Badge>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="p-1.5 rounded hover:bg-neutral-border-light text-neutral-dark-grey hover:text-neutral-black transition-colors"
                        onClick={() => router.push(`/dashboard/employees/${user.id}`)}
                        aria-label="View timesheet"
                        title="View timesheet"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!isLoading && pageItems.length === 0 && (
                <TableEmptyRow
                  colSpan={6}
                  title="No employees found"
                  description="Employees you add will appear here."
                />
              )}
            </tbody>
          </table>
        </div>

        <div className="flex w-full items-center justify-between pt-5 gap-5 mt-auto">
          <div className="text-sm flex items-center gap-2 text-neutral-dark-grey">
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
          <div className="flex items-center gap-2 text-sm text-neutral-dark-grey">
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

export default EmployeesListPage;
