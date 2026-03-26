'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, ChevronUp, ChevronDown, ChevronsUpDown, EllipsisVertical, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { useGetUniversity, University } from '@/query/get-university';
import { useGetAllCourses } from '@/query/get-course';
import { useDeleteUniversity } from '@/mutations/university/delete-university';
import { downloadFile } from '@/utils/download';
import EmptyUniversityIcon from '@/assets/icons/empty-university-icon';

type SortField = 'name' | 'educationLevel' | 'location';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const UniversityListPage = () => {
  const router = useRouter();
  const { data: universities = [], isLoading } = useGetUniversity();
  const { data: allCourses = [] } = useGetAllCourses();
  const { mutate: deleteUniversity } = useDeleteUniversity();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const coursesByUniversity = useMemo(() => {
    const map = new Map<number, typeof allCourses>();
    allCourses.forEach((c) => {
      if (!map.has(c.universityId)) map.set(c.universityId, []);
      map.get(c.universityId)!.push(c);
    });
    return map;
  }, [allCourses]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return universities;
    return universities.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        (u.educationLevel ?? '').toLowerCase().includes(q) ||
        (u.location ?? '').toLowerCase().includes(q)
      );
    });
  }, [universities, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = (a[sortField] ?? '') as string;
      const bVal = (b[sortField] ?? '') as string;
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
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

  const toggleExpand = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 inline opacity-60" />;
    return sortDir === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 ml-1 inline" />
      : <ChevronDown className="h-3.5 w-3.5 ml-1 inline" />;
  };

  const handleExport = useCallback(() => {
    if (!universities.length) return;
    const headers = ['ID', 'University Name', 'Group', 'Location', 'Description', 'Track in Report'];
    const rows = universities.map((u) => [
      u.id,
      u.name,
      u.educationLevel || '',
      u.location || '',
      (u.description || '').replace(/<[^>]*>/g, ''),
      u.trackInReport !== null ? String(u.trackInReport) : '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'universities.csv', 'text/csv;charset=utf-8;');
  }, [universities]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">University</h3>
      </Portal>

      <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 h-full overflow-hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between pb-5 gap-5">
          <Input
            placeholder="Search by university, group or location"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-[22rem]"
          />
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" className="mr-2" onClick={handleExport}>
              Export
            </Button>
            <ButtonLink href={ROUTES.ADD_UNIVERSITY} LeftIcon={Plus}>
              Add university
            </ButtonLink>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full caption-bottom border-none text-sm">
            <thead className="sticky top-0 z-10 bg-component-hovered-light">
              <tr className="*:px-3 *:py-2 *:text-neutral-darkGrey *:text-left *:align-middle *:text-[.875rem] border-b border-neutral-border-light">
                <th className="w-12">S.N</th>
                <th
                  className="min-w-[200px] cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  University name <SortIcon field="name" />
                </th>
                <th
                  className="min-w-[140px] cursor-pointer select-none"
                  onClick={() => handleSort('educationLevel')}
                >
                  Group <SortIcon field="educationLevel" />
                </th>
                <th
                  className="min-w-[180px] cursor-pointer select-none"
                  onClick={() => handleSort('location')}
                >
                  Location <SortIcon field="location" />
                </th>
                <th className="min-w-[180px]">Description</th>
                <th className="min-w-[120px]">Track in report</th>
                <th className="w-10">D</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(pageSize).fill(null).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 *:px-3 *:py-2.5">
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-44" /></td>
                      <td><Skeleton className="h-5 w-28" /></td>
                      <td><Skeleton className="h-5 w-36" /></td>
                      <td><Skeleton className="h-5 w-36" /></td>
                      <td><Skeleton className="h-5 w-16" /></td>
                      <td><Skeleton className="h-5 w-8" /></td>
                      <td><Skeleton className="h-5 w-8" /></td>
                    </tr>
                  ))
                : pageItems.flatMap((university, idx) => {
                    const isExpanded = expandedIds.has(university.id);
                    const courses = coursesByUniversity.get(university.id) ?? [];
                    const files = Array.isArray(university.files) ? university.files : [];
                    const desc = university.description
                      ? university.description.replace(/<[^>]*>/g, '')
                      : null;

                    return [
                      <tr
                        key={university.id}
                        className="border-b border-gray-50 hover:bg-muted transition-colors *:px-3 *:py-2.5 *:text-neutral-darkGrey cursor-pointer"
                        onClick={() => router.push(`/university/${university.id}/view`)}
                      >
                        <td className="text-sm">{(page - 1) * pageSize + idx + 1}</td>
                        <td className="font-medium">
                          <div className="flex items-center gap-2">
                            {courses.length > 0 && (
                              <button
                                className="p-0.5 rounded hover:bg-gray-200 text-gray-400 flex-shrink-0"
                                onClick={(e) => toggleExpand(university.id, e)}
                                aria-label={isExpanded ? 'Collapse courses' : 'Expand courses'}
                              >
                                {isExpanded
                                  ? <ChevronUp className="h-3.5 w-3.5" />
                                  : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>
                            )}
                            <span className="truncate max-w-[200px]">{university.name}</span>
                          </div>
                        </td>
                        <td>{university.educationLevel || '-'}</td>
                        <td className="truncate max-w-[200px]">{university.location || '-'}</td>
                        <td className="truncate max-w-[200px] text-gray-600">{desc || '-'}</td>
                        <td>{university.trackInReport === null ? '-' : university.trackInReport ? 'TRUE' : 'FALSE'}</td>
                        <td>
                          {files.length > 0 ? (
                            <div className="flex items-center gap-1 text-gray-500">
                              <FileText className="h-4 w-4" />
                              <span className="text-xs">{files.length}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-1" align="end">
                              <div className="flex flex-col">
                                <Button
                                  variant="ghost"
                                  className="justify-start gap-2"
                                  onClick={() => router.push(`/university/${university.id}/view`)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="justify-start gap-2"
                                  onClick={() => router.push(`/university/${university.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <DeleteDialog
                                  trigger={
                                    <Button variant="ghost" className="justify-start gap-2 text-red-600 hover:text-red-700 w-full">
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </Button>
                                  }
                                  title="Delete University"
                                  description="Are you sure you want to delete this university? This action cannot be undone."
                                  onConfirm={() => deleteUniversity(university.id)}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>,

                      ...(isExpanded && courses.length > 0
                        ? [
                            <tr key={`${university.id}-courses`} className="border-b border-gray-50 bg-gray-50/60">
                              <td colSpan={8} className="px-4 py-3">
                                <div className="ml-8">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Available courses
                                  </p>
                                  <table className="w-full text-sm">
                                    <tbody>
                                      {courses.map((course) => (
                                        <tr key={course.id} className="*:py-1.5">
                                          <td className="text-gray-800 w-1/2">{course.name}</td>
                                          <td className="text-gray-500">{course.description || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>,
                          ]
                        : []),
                    ];
                  })}

              {!isLoading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <EmptyUniversityIcon />
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

export default UniversityListPage;
