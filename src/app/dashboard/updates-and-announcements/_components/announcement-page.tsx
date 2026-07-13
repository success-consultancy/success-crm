'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSearchParams from '@/hooks/use-search-params';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { useGetAnnouncements, ANNOUNCEMENT_FILTER_PARAMS } from '@/query/get-announcements';
import { useDeleteAnnouncement, useDeleteAnnouncementBulk } from '@/mutations/announcement/delete-announcement';
import { IAnnouncement } from '@/types/response-types/announcement-response';
import { useAnnouncementColumn } from '@/config/columns/announcement-columns-definitions';
import { Megaphone } from 'lucide-react';
import ClearFilters from '@/components/molecules/clear-filters';

const emptyState = (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Megaphone className="h-12 w-12 text-gray-300" />
    <h3 className="mt-4 text-base font-semibold text-gray-800">No announcements yet</h3>
    <p className="mt-1 text-sm text-gray-500 max-w-xs">
      Announcements and updates will appear here once they are published.
    </p>
  </div>
);

const AnnouncementPage = () => {
  const { getSearchParamsObject, setParams } = useSearchParams();
  const router = useRouter();

  const filterParams = getSearchParamsObject(ANNOUNCEMENT_FILTER_PARAMS);

  const { data, isLoading } = useGetAnnouncements({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
  });

  const { mutateAsync: deleteAnnouncement } = useDeleteAnnouncement();
  const { mutateAsync: deleteAnnouncementBulk } = useDeleteAnnouncementBulk();

  const handleDelete = (id: number) => {
    deleteAnnouncement(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteAnnouncementBulk(ids);
  };

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    setParams([
      { name: 'from', value: range.from?.toISOString() || null },
      { name: 'to', value: range.to?.toISOString() || null },
    ]);
  };

  const AnnouncementColumns = useAnnouncementColumn(handleDelete);
  const [visibleColumns] = useState<ColumnDef<IAnnouncement>[]>(AnnouncementColumns);

  const handleRowClick = useCallback(
    (announcement: IAnnouncement) => {
      router.push(ROUTES.VIEW_ANNOUNCEMENT(announcement.id));
    },
    [router],
  );

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">News & Updates </h3>
      </Portal>
      <TableComponent
        data={data?.rows as IAnnouncement[]}
        columns={visibleColumns}
        storageKey="announcement-column-visibility"
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="title"
        columnPinning={{
          left: ['select', 'announcement-id', 'announcement-title'],
          right: ['announcement-actions'],
        }}
        emptyState={emptyState}
        handleDateRangeApply={handleDateRangeApply}
        tableHeaderSection={
          <ClearFilters
            filterKeys={['from', 'to', 'q']}
            labels={{ from: 'From', to: 'To', q: 'Search' }}
            className="mb-3"
          />
        }
        topRightSection={
          <ButtonLink href={ROUTES.ADD_ANNOUNCEMENT} LeftIcon={Plus}>
            Add announcement
          </ButtonLink>
        }
        className="bg-neutral-white !text-neutral-darkGrey"
        onBulkDelete={handleDeleteBulk}
        onRowClick={handleRowClick}
        bulkDeleteTitle="Delete Announcements"
        bulkDeleteDescription="Are you sure you want to delete the selected announcements? This action cannot be undone."
      />
    </Container>
  );
};

export default AnnouncementPage;
