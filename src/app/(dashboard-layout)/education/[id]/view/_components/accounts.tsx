import { useState } from 'react';
import TitleBox from './title-box';
import { ColumnDef } from '@tanstack/react-table';
import TableComponent from '@/components/organisms/table';
import { IAccounts } from '@/types/response-types/education-response';
import { Input } from '@/components/ui/input';
import { useAccountsColumn } from '@/config/columns/education-accounts-columns-definitions';
import { FormAccordion } from '@/components/organisms/form-accordion';

type AccountsProps = {
  courseFee: IAccounts[];
  studentId?: number;
  isAdding?: boolean;
  draft?: Partial<IAccounts> | null;
  onDraftChange?: (field: keyof IAccounts, value: string) => void;
  compType?: 'accordion' | 'default';
};

const Accounts = ({
  courseFee,
  studentId,
  isAdding = false,
  draft,
  onDraftChange,
  compType = 'default',
}: AccountsProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const handleEditRow = (row: IAccounts) => {
    setEditingId(row?.id);
    // Update draft fields individually to match the onDraftChange pattern
    if (onDraftChange) {
      onDraftChange('planname', row.planname || '');
      onDraftChange('comission', String(row.comission || ''));
      onDraftChange('amount', String(row.amount || ''));
      onDraftChange('discount', String(row.discount || ''));
      onDraftChange('bonus', String(row.bonus || ''));
      onDraftChange('netamount', String(row.netamount || ''));
      onDraftChange('duedate', row.duedate || '');
      onDraftChange('invoicenumber', row.invoicenumber || '');
      onDraftChange('status', row.status || 'Pending');
    }
  };
  const AccountsColumns = useAccountsColumn({ onEdit: handleEditRow });

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<IAccounts>[]>(AccountsColumns);

  return (
    <Comp type={compType}>
      <div className="grid grid-cols-1 gap-y-2">
        <TableComponent
          data={courseFee || []}
          columns={visibleColumns}
          skeletonColumns={visibleColumns}
          isLoading={false}
          showPaginationSection={false}
          showHeaderSection={false}
          className="bg-neutral-white !text-neutral-darkGrey"
        />
        {(isAdding || editingId) && draft && (
          <div className="grid grid-cols-[160px_160px_160px_160px_160px_160px_160px_128px_216px] items-center gap-x-4 px-4 py-2 border-t">
            <Input placeholder="Plan name" value={draft.planname} readOnly className="bg-gray-100" />
            <Input
              placeholder="Commission"
              type="number"
              value={draft.comission}
              onChange={(e) => onDraftChange?.('comission', e.target.value)}
              className="bg-white border-blue-300"
            />
            <Input placeholder="Amount" value={draft.amount} readOnly className="bg-gray-100" />
            <Input
              placeholder="Discount"
              type="number"
              value={draft.discount}
              onChange={(e) => onDraftChange?.('discount', e.target.value)}
              className="bg-white border-blue-300"
            />
            <Input
              placeholder="Bonus"
              type="number"
              value={draft.bonus}
              onChange={(e) => onDraftChange?.('bonus', e.target.value)}
              className="bg-white border-blue-300"
            />
            <Input
              placeholder="Net amount"
              value={draft.netamount}
              readOnly
              className="bg-green-50 border-green-300 font-semibold"
            />
            <Input placeholder="Due date" value={draft.duedate} readOnly className="bg-gray-100" />
            <Input placeholder="Invoice number" value={draft.invoicenumber} readOnly className="bg-gray-100" />
            <Input placeholder="Status" value={draft.status} readOnly className="bg-gray-100" />
          </div>
        )}
      </div>
    </Comp>
  );
};

const Comp = ({ children, type }: { children: React.ReactNode; type?: string }) => {
  if (type === 'accordion') {
    return (
      <FormAccordion value="item-3" title="Fee Structure">
        {children}
      </FormAccordion>
    );
  }

  return <TitleBox title="Course fee structure">{children}</TitleBox>;
};

export default Accounts;
