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
import EmptyUniversityIcon from '@/assets/icons/empty-university-icon';

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
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadFile(csv, 'universities.csv', 'text/csv;charset=utf-8;');
  }, [data]);

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
        emptyState={<EmptyUniversityIcon />}
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
        storageKey="university-column-visibility"
      />
    </Container>
  );
};

export default UniversityListPage;
