'use client';

import { Plus, ChevronDown, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSearchParams from '@/hooks/use-search-params';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import TableComponent from '@/components/organisms/table';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import TabSelector from '@/components/atoms/tab-selector';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useGetAgreements, AGREEMENT_FILTER_PARAMS } from '@/query/get-agreements';
import { useDeleteAgreement, useDeleteAgreementBulk } from '@/mutations/agreement/delete-agreement';
import { IAgreement } from '@/types/response-types/agreement-response';
import { useAgreementColumn } from '@/config/columns/agreement-columns-definitions';
import { useExportAgreements } from '@/mutations/agreement/export-agreements';
import EmptyAgreementIcon from '@/assets/icons/empty-agreement-icon';
import ClearFilters from '@/components/molecules/clear-filters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Tab Config
const BASE_TAB_CONFIG = [
  { key: 'all', label: 'All agreements' },
  { key: 'in_process', label: 'In Progress' },
  { key: 'in_effect', label: 'In Effect' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'expired', label: 'Expired' },
];

const TYPE_OPTIONS = ['Tafe', 'University', 'College', 'Both'];

const AgreementPage = () => {
  const { getSearchParamsObject, searchParams, setParams, setParam } = useSearchParams();
  const router = useRouter();

  const { ...filterParams } = getSearchParamsObject(AGREEMENT_FILTER_PARAMS);

  const currentTab = searchParams.get('tab') || 'all';
  const currentType = searchParams.get('type') || '';

  const { data, isLoading } = useGetAgreements({
    ...filterParams,
    q: filterParams?.q?.trim() || undefined,
    limit: filterParams.limit || '25',
    tab: currentTab !== 'all' ? currentTab : undefined,
    type: currentType || undefined,
  });

  const { mutateAsync: deleteAgreement } = useDeleteAgreement();
  const { mutateAsync: deleteAgreementBulk } = useDeleteAgreementBulk();
  const { mutateAsync: exportAgreements, isPending: isExporting } = useExportAgreements();

  const handleDelete = (id: number) => {
    deleteAgreement(id);
  };

  const handleDeleteBulk = (ids: number[]) => {
    deleteAgreementBulk(ids);
  };

  const AgreementColumns = useAgreementColumn(handleDelete);

  const [visibleColumns] = useState<ColumnDef<IAgreement>[]>(AgreementColumns);

  const handleTabChange = (tabKey: string) => {
    setParams([{ name: 'tab', value: tabKey }]);
  };

  const handleTypeChange = (type: string) => {
    setParam('type', type === currentType ? '' : type);
  };

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    setParams([
      { name: 'from', value: range.from?.toISOString() || null },
      { name: 'to', value: range.to?.toISOString() || null },
    ]);
  };

  const TAB_CONFIG = BASE_TAB_CONFIG.map((tab) => {
    if (tab.key === 'all' && data?.count) {
      return { ...tab, count: data.count };
    }
    return tab;
  });

  const handleRowClick = useCallback(
    (agreement: IAgreement) => {
      router.push(`/dashboard/agreement/${agreement.id}/view`);
    },
    [router],
  );

  const typeFilter = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1.5 px-3 h-9 rounded-md border text-sm transition-colors ${currentType
              ? 'border-primary bg-primary/5 text-primary font-medium'
              : 'border-input bg-background text-muted-foreground hover:bg-accent'
            }`}
        >
          {currentType ? `Type: ${currentType}` : 'Type'}
          {currentType ? (
            <X
              className="h-3.5 w-3.5 ml-0.5"
              onClick={(e) => {
                e.stopPropagation();
                setParam('type', '');
              }}
            />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {TYPE_OPTIONS.map((type) => (
          <DropdownMenuItem
            key={type}
            className={currentType === type ? 'bg-accent font-medium' : ''}
            onClick={() => handleTypeChange(type)}
          >
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <EmptyAgreementIcon />
      <h3 className="mt-4 text-base font-semibold text-gray-800">No agency agreements yet</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">
        Universities with agency agreements will appear here once an agreement is added.
      </p>
    </div>
  );

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Agency agreement</h3>
      </Portal>
      <TableComponent
        data={data?.rows as IAgreement[]}
        columns={visibleColumns}
        skeletonColumns={visibleColumns}
        isLoading={isLoading}
        offset={filterParams.limit || 25}
        totalItems={data?.count}
        currentPage={filterParams.page}
        searchKey="university"
        columnPinning={{
          left: ['select', 'agreement-id', 'agreement-university'],
          right: ['agreement-actions'],
        }}
        extraFilters={typeFilter}
        emptyState={emptyState}
        topRightSection={
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mr-[14px]" />
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => exportAgreements({ ...filterParams, type: currentType || undefined, tab: currentTab !== 'all' ? currentTab : undefined })}
              loading={isExporting}
            >
              Export
            </Button>
            <ButtonLink href={ROUTES.ADD_AGREEMENT} LeftIcon={Plus}>
              Add agreement
            </ButtonLink>
          </div>
        }
        tableHeaderSection={
          <div>
            <TabSelector btnClassName="mb-2" activeTab={currentTab} onTabChange={handleTabChange} tabs={TAB_CONFIG} />
            <ClearFilters
              filterKeys={['tab', 'type', 'from', 'to', 'q']}
              labels={{ tab: 'Status', type: 'Type', from: 'From', to: 'To', q: 'Search' }}
              defaultValues={{ tab: 'all' }}
              className="mb-3"
            />
          </div>
        }
        className="bg-neutral-white !text-neutral-darkGrey"
        onBulkDelete={handleDeleteBulk}
        handleDateRangeApply={handleDateRangeApply}
        onRowClick={handleRowClick}
        bulkDeleteTitle="Delete Agreements"
        bulkDeleteDescription="Are you sure you want to delete the selected agreements? This action cannot be undone."
      />
    </Container>
  );
};

export default AgreementPage;
