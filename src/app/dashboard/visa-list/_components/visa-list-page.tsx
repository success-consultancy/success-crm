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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetVisaConst, IVisaConst } from '@/query/get-visa';
import { useAddVisaConst } from '@/mutations/visa-const/add-visa-const';
import { useEditVisaConst } from '@/mutations/visa-const/edit-visa-const';
import { useDeleteVisaConst } from '@/mutations/visa-const/delete-visa-const';
import { downloadFile } from '@/utils/download';

type SortField = 'visaType' | 'createdAt' | 'updatedAt';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const VisaListPage = () => {
  const { data: visas = [], isLoading } = useGetVisaConst();
  const { mutate: addVisa, isPending: isAdding } = useAddVisaConst();
  const { mutate: editVisa, isPending: isEditing } = useEditVisaConst();
  const { mutate: deleteVisa } = useDeleteVisaConst();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('visaType');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ visaType: '' });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return visas;
    return visas.filter((v) => (v.visaType ?? '').toLowerCase().includes(q));
  }, [visas, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'visaType') {
        aVal = a.visaType ?? '';
        bVal = b.visaType ?? '';
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
    setForm({ visaType: '' });
    setShowAddForm(true);
  };

  const openEdit = (v: IVisaConst) => {
    setShowAddForm(false);
    setEditingId(v.id);
    setForm({ visaType: v.visaType ?? '' });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setForm({ visaType: '' });
  };

  const handleSubmit = () => {
    const visaType = form.visaType.trim();
    if (!visaType) return;
    if (editingId !== null) {
      editVisa({ id: editingId, visaType }, { onSuccess: cancelForm });
    } else {
      addVisa({ visaType }, { onSuccess: cancelForm });
    }
  };

  const handleExport = useCallback(() => {
    const headers = ['ID', 'Visa Type', 'Created At', 'Updated At'];
    const rows = visas.map((v) => [
      v.id,
      v.visaType,
      format(new Date(v.createdAt), 'dd/MM/yyyy HH:mm'),
      format(new Date(v.updatedAt), 'dd/MM/yyyy HH:mm'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'visa-types.csv', 'text/csv;charset=utf-8;');
  }, [visas]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Visa list</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full min-h-0 overflow-hidden">
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <Input
            placeholder="Search by visa type"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-[18rem]"
          />
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" className="mr-2" onClick={handleExport}>
              Export
            </Button>
            <Button LeftIcon={Plus} onClick={openAdd} disabled={showAddForm}>
              Add visa type
            </Button>
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-dark-grey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th className="min-w-[280px] cursor-pointer select-none" onClick={() => handleSort('visaType')}>
                  Visa type <SortIcon field="visaType" />
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
                Array(8)
                  .fill(null)
                  .map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 *:px-3 *:py-2.5">
                      <td>
                        <Skeleton className="h-5 w-6" />
                      </td>
                      <td>
                        <Skeleton className="h-5 w-56" />
                      </td>
                      <td>
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td>
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td>
                        <Skeleton className="h-5 w-12" />
                      </td>
                    </tr>
                  ))
              ) : (
                pageItems.map((visa, idx) => {
                  const isEditingRow = editingId === visa.id;
                  return isEditingRow ? (
                    <tr key={visa.id} className="border-b border-gray-50 bg-muted/40 *:px-2 *:py-2">
                      <td className="px-3 text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td>
                        <Input
                          placeholder="Visa type"
                          value={form.visaType}
                          onChange={(e) => setForm({ visaType: e.target.value })}
                          className="h-9 text-sm"
                          autoFocus
                        />
                      </td>
                      <td colSpan={2} />
                      <td>
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="sm" onClick={handleSubmit} disabled={!form.visaType.trim() || isEditing}>
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
                      key={visa.id}
                      className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-dark-grey last:border-none"
                    >
                      <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td className="font-medium truncate max-w-[400px]">{visa.visaType}</td>
                      <td className="whitespace-nowrap">{format(new Date(visa.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="whitespace-nowrap">{format(new Date(visa.updatedAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-1.5 rounded hover:bg-neutral-border-light text-neutral-dark-grey hover:text-neutral-black transition-colors"
                            onClick={() => openEdit(visa)}
                            aria-label="Edit visa type"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <DeleteDialog
                            trigger={
                              <button
                                className="p-1.5 rounded hover:bg-red-50 text-neutral-dark-grey hover:text-utility-red transition-colors"
                                aria-label="Delete visa type"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            }
                            title="Delete visa type"
                            description="Are you sure you want to delete this visa type?"
                            confirmText="Yes, delete"
                            confirmClassName="bg-red-600 hover:bg-red-700 text-white"
                            onConfirm={() => deleteVisa(visa.id)}
                          />
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
                      placeholder="Visa type"
                      value={form.visaType}
                      onChange={(e) => setForm({ visaType: e.target.value })}
                      className="h-9 text-sm"
                      autoFocus
                    />
                  </td>
                  <td colSpan={2} />
                  <td>
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" onClick={handleSubmit} disabled={!form.visaType.trim() || isAdding}>
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
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    No visa types found
                  </td>
                </tr>
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

export default VisaListPage;
