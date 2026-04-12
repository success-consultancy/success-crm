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
import { useGetAllCourses, Course } from '@/query/get-course';
import { useGetUniversity } from '@/query/get-university';
import { useAddCourse } from '@/mutations/course/add-course';
import { useEditCourse } from '@/mutations/course/edit-course';
import { useDeleteCourse } from '@/mutations/course/delete-course';
import { downloadFile } from '@/utils/download';

type SortField = 'universityName' | 'name' | 'createdAt' | 'updatedAt';
type SortDir = 'asc' | 'desc';

interface FormState {
  universityId: string;
  name: string;
  description: string;
}

const EMPTY_FORM: FormState = { universityId: '', name: '', description: '' };
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const CourseListPage = () => {
  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourses();
  const { data: universities = [], isLoading: universitiesLoading } = useGetUniversity();
  const { mutate: addCourse, isPending: isAdding } = useAddCourse();
  const { mutate: editCourse, isPending: isEditing } = useEditCourse();
  const { mutate: deleteCourse } = useDeleteCourse();

  const isLoading = coursesLoading || universitiesLoading;

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const universityMap = useMemo(
    () => new Map(universities.map((u) => [u.id, u.name])),
    [universities],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((c) => {
      const uName = (universityMap.get(c.universityId) ?? '').toLowerCase();
      return uName.includes(q) || c.name.toLowerCase().includes(q);
    });
  }, [courses, search, universityMap]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'universityName') {
        aVal = universityMap.get(a.universityId) ?? '';
        bVal = universityMap.get(b.universityId) ?? '';
      } else if (sortField === 'name') {
        aVal = a.name;
        bVal = b.name;
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
  }, [filtered, sortField, sortDir, universityMap]);

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
    return sortDir === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 ml-1 inline" />
      : <ChevronDown className="h-3.5 w-3.5 ml-1 inline" />;
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowAddForm(true);
  };

  const openEdit = (course: Course) => {
    setShowAddForm(false);
    setEditingId(course.id);
    setForm({
      universityId: course.universityId ? String(course.universityId) : '',
      name: course.name,
      description: course.description ?? '',
    });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      universityId: form.universityId ? Number(form.universityId) : undefined,
    };
    if (!payload.name) return;

    if (editingId !== null) {
      editCourse({ id: editingId, ...payload }, { onSuccess: cancelForm });
    } else {
      addCourse(payload, { onSuccess: cancelForm });
    }
  };

  const handleExport = useCallback(() => {
    const headers = ['ID', 'University Name', 'Course Name', 'Description', 'Created At', 'Updated At'];
    const rows = courses.map((c) => [
      c.id,
      universityMap.get(c.universityId) ?? '',
      c.name,
      c.description ?? '',
      format(new Date(c.createdAt), 'dd/MM/yyyy HH:mm'),
      format(new Date(c.updatedAt), 'dd/MM/yyyy HH:mm'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'courses.csv', 'text/csv;charset=utf-8;');
  }, [courses, universityMap]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Course</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full overflow-hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <Input
            placeholder="Search by university or course name"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-[18rem]"
          />
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" className="mr-2" onClick={handleExport}>
              Export
            </Button>
            <Button
              LeftIcon={Plus}
              onClick={openAdd}
              disabled={showAddForm}
            >
              Add course
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-darkGrey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th
                  className="min-w-[160px] cursor-pointer select-none"
                  onClick={() => handleSort('universityName')}
                >
                  University name <SortIcon field="universityName" />
                </th>
                <th
                  className="min-w-[200px] cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  Course name <SortIcon field="name" />
                </th>
                <th className="min-w-[140px]">Description</th>
                <th
                  className="min-w-[160px] cursor-pointer select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  Created at <SortIcon field="createdAt" />
                </th>
                <th
                  className="min-w-[160px] cursor-pointer select-none"
                  onClick={() => handleSort('updatedAt')}
                >
                  Updated at <SortIcon field="updatedAt" />
                </th>
                <th className="w-20 text-right" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(pageSize)
                    .fill(null)
                    .map((_, i) => (
                      <tr key={i} className="border-b border-gray-50 *:px-3 *:py-2.5">
                        <td><Skeleton className="h-5 w-6" /></td>
                        <td><Skeleton className="h-5 w-36" /></td>
                        <td><Skeleton className="h-5 w-44" /></td>
                        <td><Skeleton className="h-5 w-28" /></td>
                        <td><Skeleton className="h-5 w-32" /></td>
                        <td><Skeleton className="h-5 w-32" /></td>
                        <td><Skeleton className="h-5 w-12" /></td>
                      </tr>
                    ))
                : pageItems.map((course, idx) => {
                    const isEditingRow = editingId === course.id;
                    return isEditingRow ? (
                      <tr key={course.id} className="border-b border-gray-50 bg-muted/40 *:px-2 *:py-2">
                        <td className="px-3 text-sm">{(page - 1) * pageSize + idx + 1}</td>
                        <td>
                          <Select
                            value={form.universityId}
                            onValueChange={(val) => setForm((f) => ({ ...f, universityId: val }))}
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="University name" />
                            </SelectTrigger>
                            <SelectContent>
                              {universities.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)}>
                                  {u.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <Input
                            placeholder="Course name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="h-9 text-sm"
                            autoFocus
                          />
                        </td>
                        <td colSpan={2}>
                          <Input
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="h-9 text-sm"
                          />
                        </td>
                        <td colSpan={2}>
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={handleSubmit}
                              disabled={!form.name.trim() || isEditing}
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
                        key={course.id}
                        className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-darkGrey last:border-none"
                      >
                        <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                        <td className="font-medium truncate max-w-[200px]">
                          {universityMap.get(course.universityId) ?? '-'}
                        </td>
                        <td className="truncate max-w-[240px]">{course.name}</td>
                        <td className="truncate max-w-[160px] text-gray-600">
                          {course.description ?? '-'}
                        </td>
                        <td className="whitespace-nowrap">
                          {format(new Date(course.createdAt), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="whitespace-nowrap">
                          {format(new Date(course.updatedAt), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                              onClick={() => openEdit(course)}
                              aria-label="Edit course"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <DeleteDialog
                              trigger={
                                <button
                                  className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                                  aria-label="Delete course"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              }
                              title="Delete course"
                              description={
                                <span>
                                  Are you sure you want to delete this course?
                                  <br />
                                  Deleting this course will remove all associated data, including details and interactions.
                                </span>
                              }
                              confirmText="Yes, delete"
                              confirmClassName="bg-red-600 hover:bg-red-700 text-white"
                              onConfirm={() => deleteCourse(course.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}

              {/* Inline Add Form Row (appended at bottom for new entries) */}
              {showAddForm && (
                <tr className="border-t border-gray-100 *:px-2 *:py-2">
                  <td />
                  <td>
                    <Select
                      value={form.universityId}
                      onValueChange={(val) => setForm((f) => ({ ...f, universityId: val }))}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="University name" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td>
                    <Input
                      placeholder="Course name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-9 text-sm"
                      autoFocus
                    />
                  </td>
                  <td colSpan={2}>
                    <Input
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </td>
                  <td colSpan={2}>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!form.name.trim() || isAdding}
                      >
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
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    No courses found
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

export default CourseListPage;
