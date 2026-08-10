'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import SearchInput from '@/components/molecules/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DeleteDialog from '@/components/organisms/delete.dialog';
import TableSkeleton from '@/components/organisms/table-skeleton';
import TableEmptyRow from '@/components/common/table-empty-row';
import { useGetOccupations, IOccupation } from '@/query/get-occupations';
import { useAddOccupation } from '@/mutations/occupation/add-occupation';
import { useEditOccupation } from '@/mutations/occupation/edit-occupation';
import { useDeleteOccupation } from '@/mutations/occupation/delete-occupation';
import { downloadFile } from '@/utils/download';
import { usePermissions } from '@/hooks/use-permissions';

type SortField = 'code' | 'title' | 'createdAt' | 'updatedAt';
type SortDir = 'asc' | 'desc';

interface FormState {
  code: string;
  title: string;
}

const EMPTY_FORM: FormState = { code: '', title: '' };
const PAGE_SIZE_OPTIONS = [25, 50, 100, 250];

const OccupationListPage = () => {
  const { create: canCreate, update: canUpdate, delete: canDelete } = usePermissions('occupation');
  const { data: occupations = [], isLoading } = useGetOccupations();
  const { mutate: addOccupation, isPending: isAdding } = useAddOccupation();
  const { mutate: editOccupation, isPending: isEditing } = useEditOccupation();
  const { mutate: deleteOccupation } = useDeleteOccupation();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return occupations;
    return occupations.filter(
      (o) => String(o.code).toLowerCase().includes(q) || (o.title ?? '').toLowerCase().includes(q),
    );
  }, [occupations, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'code') {
        aVal = Number(a.code) || 0;
        bVal = Number(b.code) || 0;
      } else if (sortField === 'title') {
        aVal = a.title ?? '';
        bVal = b.title ?? '';
      } else if (sortField === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else if (sortField === 'updatedAt') {
        aVal = new Date(a.updatedAt).getTime();
        bVal = new Date(b.updatedAt).getTime();
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

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowAddForm(true);
  };

  const openEdit = (occ: IOccupation) => {
    setShowAddForm(false);
    setEditingId(occ.id);
    setForm({ code: String(occ.code ?? ''), title: occ.title ?? '' });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    const code = Number(form.code);
    const title = form.title.trim();
    if (!title || !form.code || Number.isNaN(code)) return;

    if (editingId !== null) {
      editOccupation({ id: editingId, code, title }, { onSuccess: cancelForm });
    } else {
      addOccupation({ code, title }, { onSuccess: cancelForm });
    }
  };

  const handleExport = useCallback(() => {
    const headers = ['ID', 'Code', 'Title', 'Created At', 'Updated At'];
    const rows = occupations.map((o) => [
      o.id,
      o.code,
      o.title,
      format(new Date(o.createdAt), 'dd/MM/yyyy HH:mm'),
      format(new Date(o.updatedAt), 'dd/MM/yyyy HH:mm'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'occupations.csv', 'text/csv;charset=utf-8;');
  }, [occupations]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Occupation</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full min-h-0 overflow-hidden">
        <div className="flex w-full items-center justify-between pb-3 gap-5">
          <SearchInput
            placeholder="Search by code or title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" className="mr-2" onClick={handleExport}>
              Export
            </Button>
            {canCreate && (
              <Button LeftIcon={Plus} onClick={openAdd} disabled={showAddForm}>
                Add occupation
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-neutral-dark-grey pb-3">
          ANZSCO — Australian and New Zealand Standard Classification of Occupations.
        </p>

        <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-dark-grey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th className="min-w-[140px] cursor-pointer select-none" onClick={() => handleSort('code')}>
                  Code <SortIcon field="code" />
                </th>
                <th className="min-w-[260px] cursor-pointer select-none" onClick={() => handleSort('title')}>
                  Title <SortIcon field="title" />
                </th>
                <th className="min-w-[160px] cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                  Created at <SortIcon field="createdAt" />
                </th>
                <th className="min-w-[160px] cursor-pointer select-none" onClick={() => handleSort('updatedAt')}>
                  Updated at <SortIcon field="updatedAt" />
                </th>
                <th className="w-24 text-right" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton columns={6} rows={pageSize} />
              ) : (
                pageItems.map((occ, idx) => {
                  const isEditingRow = editingId === occ.id;
                  return isEditingRow ? (
                    <tr key={occ.id} className="border-b border-gray-50 bg-muted/40 *:px-2 *:py-2">
                      <td className="px-3 text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td>
                        <Input
                          type="number"
                          placeholder="Code"
                          value={form.code}
                          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                          className="h-9 text-sm"
                          autoFocus
                        />
                      </td>
                      <td>
                        <Input
                          placeholder="Title"
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          className="h-9 text-sm"
                        />
                      </td>
                      <td colSpan={2} />
                      <td>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={handleSubmit}
                            disabled={!form.title.trim() || !form.code || isEditing}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelForm}>
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={occ.id}
                      className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-dark-grey last:border-none"
                    >
                      <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td className="font-medium">{occ.code}</td>
                      <td className="truncate max-w-[400px]">{occ.title}</td>
                      <td className="whitespace-nowrap">{format(new Date(occ.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="whitespace-nowrap">{format(new Date(occ.updatedAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canUpdate && (
                            <button
                              className="p-1.5 rounded hover:bg-neutral-border-light text-neutral-dark-grey hover:text-neutral-black transition-colors"
                              onClick={() => openEdit(occ)}
                              aria-label="Edit occupation"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <DeleteDialog
                              trigger={
                                <button
                                  className="p-1.5 rounded hover:bg-red-50 text-neutral-dark-grey hover:text-utility-red transition-colors"
                                  aria-label="Delete occupation"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              }
                              title="Delete occupation"
                              description="Are you sure you want to delete this occupation?"
                              confirmText="Yes, delete"
                              onConfirm={() => deleteOccupation(occ.id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {showAddForm && (
                <tr className="border-t border-gray-100 *:px-2 *:py-2">
                  <td />
                  <td>
                    <Input
                      type="number"
                      placeholder="Code"
                      value={form.code}
                      onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                      className="h-9 text-sm"
                      autoFocus
                    />
                  </td>
                  <td>
                    <Input
                      placeholder="Title"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </td>
                  <td colSpan={2} />
                  <td>
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" onClick={handleSubmit} disabled={!form.title.trim() || !form.code || isAdding}>
                        Add
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelForm}>
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && pageItems.length === 0 && !showAddForm && editingId === null && (
                <TableEmptyRow
                  colSpan={6}
                  title="No occupations found"
                  description="Occupations you add will appear here."
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

export default OccupationListPage;
