import { useMemo, useCallback } from 'react';
import TitleBox from './title-box';
import TableComponent from '@/components/organisms/table';
import { Input } from '@/components/ui/input';
import Button from '@/components/atoms/button';
import { useAccountsColumn } from '@/config/columns/education-accounts-columns-definitions';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { CreateAccountPayload, IAccount } from '@/schema/account-schema';

type AccountsProps = {
  courseFee: IAccount[];
  studentId?: number;
  /** True when adding a new fee row (show form below). */
  isAdding?: boolean;
  /** When set, the account linked to this fee is edited inline in the table; no new row form. */
  editingFeeId?: number | null;
  /** Account row id to edit inline when editing a fee (that account row shows inputs). */
  editingAccountId?: number | null;
  /** Set by parent when user clicks Edit on an account row (direct inline edit). */
  editingAccountRowId?: number | null;
  draft?: CreateAccountPayload | null;
  onDraftChange?: (field: keyof IAccount, value: string) => void;
  /** When user clicks Edit on an account row, parent sets draft so inline editing works. */
  onStartEditAccount?: (accountId: number, draft: CreateAccountPayload) => void;
  onCancelEditAccount?: () => void;
  onSaveAccount?: (accountId: number, payload: CreateAccountPayload) => void;
  isSavingAccount?: boolean;
  compType?: 'accordion' | 'default';
};

const Accounts = ({
  courseFee,
  studentId,
  isAdding = false,
  editingFeeId = null,
  editingAccountId = null,
  editingAccountRowId = null,
  draft,
  onDraftChange,
  onStartEditAccount,
  onCancelEditAccount,
  onSaveAccount,
  isSavingAccount = false,
  compType = 'default',
}: AccountsProps) => {
  /** When editing a fee, the linked account is edited inline in the table; no form below. */
  const isEditingLinkedAccount = editingFeeId != null;
  const isEditingAccountDirectly = editingAccountRowId != null;
  const activeEditingId = editingAccountId ?? editingAccountRowId;

  const handleEditRow = useCallback(
    (row: IAccount) => {
      if (isEditingLinkedAccount) return;
      const accountId = row?.id;
      if (accountId == null) return;
      const draftPayload: CreateAccountPayload = {
        planname: row.planname || '',
        amount: String(row.amount ?? ''),
        duedate: row.duedate || '',
        invoicenumber: row.invoicenumber || '',
        status: row.status || 'Pending',
        comission: String(row.comission ?? ''),
        discount: String(row.discount ?? ''),
        bonus: String(row.bonus ?? ''),
        netamount: String(row.netamount ?? ''),
        accountableId: row.accountableId ?? 0,
        accountableType: row.accountableType ?? '',
      };
      onStartEditAccount?.(accountId, draftPayload);
    },
    [isEditingLinkedAccount, onStartEditAccount],
  );

  const columnIdToField: Record<string, keyof IAccount> = {
    'accounts-commission': 'comission',
    'accounts-discount': 'discount',
    'accounts-bonus': 'bonus',
  };

  const handleCellUpdate = (row: IAccount, columnId: string, value: unknown) => {
    if (activeEditingId == null || row.id !== activeEditingId || !onDraftChange) return;
    const field = columnIdToField[columnId];
    if (!field) return;
    onDraftChange(field, String(value ?? ''));
  };

  const AccountsColumns = useMemo(
    () =>
      useAccountsColumn({
        onEdit: handleEditRow,
        hideEditWhen: isEditingLinkedAccount,
        editingId: activeEditingId,
        draft,
      }),
    [handleEditRow, isEditingLinkedAccount, activeEditingId],
  );

  return (
    <Comp type={compType}>
      <div className="grid grid-cols-1 gap-y-2">
        <TableComponent
          data={courseFee || []}
          columns={AccountsColumns}
          skeletonColumns={AccountsColumns}
          isLoading={false}
          showPaginationSection={false}
          showHeaderSection={false}
          className="bg-neutral-white !text-neutral-darkGrey"
          onCellUpdate={handleCellUpdate}
          meta={{ editingId: activeEditingId, draft }}
        />
        {/* Save/Cancel when editing an account row directly (inline); no extra form. */}
        {isEditingAccountDirectly && draft && editingAccountRowId != null && (
          <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30">
            <Button size="sm" onClick={() => onSaveAccount?.(editingAccountRowId!, draft)} disabled={isSavingAccount}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => onCancelEditAccount?.()} disabled={isSavingAccount}>
              Cancel
            </Button>
          </div>
        )}
        {/* Form below only when adding a new fee row. */}
        {isAdding && draft && (
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

  return <TitleBox title="Accounts">{children}</TitleBox>;
};

export default Accounts;
