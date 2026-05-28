'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSource, ISource } from '@/query/get-source';
import { useAddSource } from '@/mutations/source/add-source';
import { useEditSource } from '@/mutations/source/edit-source';
import { downloadFile } from '@/utils/download';

type SortField = 'name' | 'description' | 'createdAt' | 'updatedAt';
type SortDir = 'asc' | 'desc';

interface FormState {
  name: string;
  description: string;
}

const EMPTY_FORM: FormState = { name: '', description: '' };
const PAGE_SIZE_OPTIONS = [25, 50, 100];

const SourceListPage = () => {
  const { data: sources = [], isLoading } = useGetSource();
  const { mutate: addSource, isPending: isAdding } = useAddSource();
  const { mutate: editSource, isPending: isEditing } = useEditSource();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return sources;
    return sources.filter(
      (s) => (s.name ?? '').toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q),
    );
  }, [sources, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'name') {
        aVal = a.name ?? '';
        bVal = b.name ?? '';
      } else if (sortField === 'description') {
        aVal = a.description ?? '';
        bVal = b.description ?? '';
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

  const openEdit = (s: ISource) => {
    setShowAddForm(false);
    setEditingId(s.id);
    setForm({ name: s.name ?? '', description: s.description ?? '' });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    const description = form.description.trim();
    if (!name) return;

    if (editingId !== null) {
      editSource({ id: editingId, name, description: description || null }, { onSuccess: cancelForm });
    } else {
      addSource({ name, description: description || null }, { onSuccess: cancelForm });
    }
  };

  const handleExport = useCallback(() => {
    const headers = ['ID', 'Name', 'Description', 'Created At', 'Updated At'];
    const rows = sources.map((s) => [
      s.id,
      s.name,
      s.description ?? '',
      format(new Date(s.createdAt), 'dd/MM/yyyy HH:mm'),
      format(new Date(s.updatedAt), 'dd/MM/yyyy HH:mm'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'sources.csv', 'text/csv;charset=utf-8;');
  }, [sources]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Source</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full min-h-0 overflow-hidden">
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <Input
            placeholder="Search by name or description"
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
              Add source
            </Button>
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-dark-grey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th className="min-w-[180px] cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Name <SortIcon field="name" />
                </th>
                <th className="min-w-[260px] cursor-pointer select-none" onClick={() => handleSort('description')}>
                  Description <SortIcon field="description" />
                </th>
                <th className="min-w-[160px] cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                  Created at <SortIcon field="createdAt" />
                </th>
                <th className="min-w-[160px] cursor-pointer select-none" onClick={() => handleSort('updatedAt')}>
                  Updated at <SortIcon field="updatedAt" />
                </th>
                <th className="w-20 text-right" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 *:px-3 *:py-2.5">
                      <td>
                        <Skeleton className="h-5 w-6" />
                      </td>
                      <td>
                        <Skeleton className="h-5 w-36" />
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
                pageItems.map((source, idx) => {
                  const isEditingRow = editingId === source.id;
                  return isEditingRow ? (
                    <tr key={source.id} className="border-b border-gray-50 bg-muted/40 *:px-2 *:py-2">
                      <td className="px-3 text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td>
                        <Input
                          placeholder="Name"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="h-9 text-sm"
                          autoFocus
                        />
                      </td>
                      <td>
                        <Input
                          placeholder="Description"
                          value={form.description}
                          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                          className="h-9 text-sm"
                        />
                      </td>
                      <td colSpan={2} />
                      <td>
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="sm" onClick={handleSubmit} disabled={!form.name.trim() || isEditing}>
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
                      key={source.id}
                      className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-dark-grey last:border-none"
                    >
                      <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td className="font-medium">{source.name}</td>
                      <td className="truncate max-w-[300px]">{source.description ?? '-'}</td>
                      <td className="whitespace-nowrap">{format(new Date(source.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="whitespace-nowrap">{format(new Date(source.updatedAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="text-right">
                        <button
                          className="p-1.5 rounded hover:bg-neutral-border-light text-neutral-dark-grey hover:text-neutral-black transition-colors"
                          onClick={() => openEdit(source)}
                          aria-label="Edit source"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
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
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-9 text-sm"
                      autoFocus
                    />
                  </td>
                  <td>
                    <Input
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </td>
                  <td colSpan={2} />
                  <td>
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" onClick={handleSubmit} disabled={!form.name.trim() || isAdding}>
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
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    No sources found
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

export default SourceListPage;
