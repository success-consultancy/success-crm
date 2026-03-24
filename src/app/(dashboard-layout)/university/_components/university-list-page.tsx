'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import { Separator } from '@/components/ui/separator';
import { useGetUniversity, University } from '@/query/get-university';
import { useDeleteUniversity } from '@/mutations/university/delete-university';
import { useUniversityColumns } from '@/config/columns/university-columns-definitions';
import { downloadFile } from '@/utils/download';

const UniversityListPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetUniversity();
  const { mutate: deleteUniversity } = useDeleteUniversity();

  const handleDelete = useCallback(
    (id: number) => {
      deleteUniversity(id);
    },
    [deleteUniversity],
  );

  const UniversityColumns = useUniversityColumns(handleDelete);
  const [visibleColumns] = useState<ColumnDef<University>[]>(UniversityColumns);

  const handleRowClick = useCallback(
    (university: University) => {
      router.push(`/university/${university.id}/view`);
    },
    [router],
  );

  const handleExport = useCallback(() => {
    if (!data) return;
    const headers = ['ID', 'University Name', 'Group', 'Location', 'Description', 'Track in Report'];
    const rows = data.map((u) => [
      u.id,
      u.name,
      u.educationLevel || '',
      u.location || '',
      (u.description || '').replace(/<[^>]*>/g, ''),
      u.trackInReport !== null ? String(u.trackInReport) : '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csv, 'universities.csv', 'text/csv;charset=utf-8;');
  }, [data]);

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#F5F5F5" />
        <path d="M60 30L30 50V55H90V50L60 30Z" fill="#D1D5DB" />
        <rect x="35" y="55" width="10" height="30" fill="#9CA3AF" />
        <rect x="55" y="55" width="10" height="30" fill="#9CA3AF" />
        <rect x="75" y="55" width="10" height="30" fill="#9CA3AF" />
        <rect x="30" y="85" width="60" height="5" fill="#D1D5DB" />
        <circle cx="60" cy="28" r="5" fill="#6B7280" />
      </svg>
      <h3 className="mt-4 text-base font-semibold text-gray-800">No universities found</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        Add universities here to manage applications, agreements and student placements.
      </p>
    </div>
  );

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">University</h3>
      </Portal>
      <TableComponent
        data={data as University[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        searchKey="name"
        columnPinning={{
          left: ['select', 'university-name'],
          right: ['university-actions'],
        }}
        emptyState={emptyState}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button variant="outline" className="mr-2" onClick={handleExport}>
              Export
            </Button>
            <ButtonLink href={ROUTES.ADD_UNIVERSITY} LeftIcon={Plus}>
              Add university
            </ButtonLink>
          </div>
        }
        className="bg-neutral-white !text-neutral-darkGrey"
        onRowClick={handleRowClick}
        bulkDeleteTitle="Delete Universities"
        bulkDeleteDescription="Are you sure you want to delete the selected universities? This action cannot be undone."
      />
    </Container>
  );
};

export default UniversityListPage;
