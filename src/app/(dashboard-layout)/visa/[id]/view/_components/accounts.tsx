import { useState, useMemo, useCallback } from 'react';
import TitleBox from './title-box';
import TableComponent from '@/components/organisms/table';
import { Input } from '@/components/ui/input';
import { useVisaAccountsColumn } from '@/config/columns/visaApplicant-accounts-columns-definitions';
import { Button } from '@/components/ui/button';
import { createEmptyDraft, updateDraftField } from '@/utils/account';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddAccount, useUpdateAccount } from '@/mutations/account/add-account';
import { CreateAccountPayload, IAccount } from '@/schema/account-schema';
import { DatePicker } from '@/components/organisms/date-picker';

type AccountsProps = {
  accounts: IAccount[];
  visaApplicantId?: number;
  isAdding?: boolean;
};

const Accounts = ({ accounts, visaApplicantId, isAdding = false }: AccountsProps) => {
  const [draft, setDraft] = useState<CreateAccountPayload>(createEmptyDraft());
  const [adding, setAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleEditRow = useCallback((row: IAccount) => {
    const accountId = row?.id;
    if (accountId == null) return;
    setEditingId(accountId);
    setDraft({
      planname: row.planname || '',
      amount: String(row.amount ?? ''),
      duedate: row.duedate || '',
      invoicenumber: row.invoicenumber || '',
      status: row.status || 'Pending',
      discount: String(row.discount ?? ''),
      netamount: String(row.netamount ?? ''),
      gst: String(row.gst ?? ''),
      accountableId: row.accountableId ?? 0,
      accountableType: row.accountableType ?? '',
    });
  }, []);

  const handleDraftChange = (key: keyof CreateAccountPayload, value: string) => {
    setDraft((prev) => updateDraftField(prev, key, value));
  };

  const columnIdToField: Record<string, keyof CreateAccountPayload> = {
    'accounts-payment-plan': 'planname',
    'accounts-amount': 'amount',
    'accounts-discount': 'discount',
    'accounts-invoice-number': 'invoicenumber',
    'accounts-due-date': 'duedate',
    'accounts-status': 'status',
  };

  const handleCellUpdate = (row: IAccount, columnId: string, value: unknown) => {
    if (editingId == null || row.id !== editingId) return;
    const field = columnIdToField[columnId];
    if (!field) return;
    handleDraftChange(field, String(value ?? ''));
  };

  const AccountsColumns = useMemo(
    () =>
      useVisaAccountsColumn({
        onEdit: handleEditRow,
        editingId,
        draft,
      }),
    [handleEditRow, editingId],
  );

  const createAccount = useAddAccount();
  const updateAccount = useUpdateAccount();

  const handleCancel = () => {
    setDraft(createEmptyDraft());
    setAdding(false);
    setEditingId(null);
  };

  const handleAddRow = () => {
    setAdding(true);
    setDraft(createEmptyDraft());
  };
  const handleSave = () => {
    if (!visaApplicantId || !draft) return;

    const accountsData = {
      planname: draft.planname,
      amount: draft.amount,
      duedate: draft.duedate,
      invoicenumber: draft.invoicenumber,
      status: draft.status,
      discount: draft.discount,
      netamount: draft.netamount,
      gst: (0.1 * Number(draft.amount)).toLocaleString(),
    };

    if (editingId) {
      updateAccount.mutateAsync(
        {
          id: editingId,
          payload: {
            accountableId: visaApplicantId,
            accountableType: 'VisaApplicant',
            ...accountsData,
          },
        },
        {
          onSuccess: () => {
            setAdding(false);
            setDraft(createEmptyDraft());
            setEditingId(null);
          },
        },
      );
    } else {
      createAccount.mutateAsync(
        {
          accountableId: visaApplicantId,
          accountableType: 'VisaApplicant',
          ...accountsData,
        },
        {
          onSuccess: () => {
            setAdding(false);
            setDraft(createEmptyDraft());
            setEditingId(null);
          },
        },
      );
    }
  };

  return (
    <TitleBox title="Accounts">
      <div className="grid grid-cols-1 gap-y-2">
        <TableComponent
          data={accounts || []}
          columns={AccountsColumns}
          skeletonColumns={AccountsColumns}
          isLoading={false}
          showPaginationSection={false}
          showHeaderSection={false}
          className="bg-neutral-white !text-neutral-darkGrey"
          onCellUpdate={handleCellUpdate}
          meta={{ editingId, draft }}
        />
        {editingId && draft && (
          <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30">
            <Button size="sm" onClick={handleSave} disabled={updateAccount.isPending}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={updateAccount.isPending}>
              Cancel
            </Button>
          </div>
        )}
        {adding && draft && (
          <div className="grid grid-cols-[160px_101px_101px_101px_101px_160px_160px_128px] items-center gap-x-4 px-4 py-2 border-t">
            <Input
              placeholder="Plan name"
              value={draft.planname}
              onChange={(e) => handleDraftChange?.('planname', e.target.value)}
              className="bg-white border-blue-300"
            />
            <Input
              placeholder="Service fee"
              type="number"
              value={draft.amount}
              onChange={(e) => handleDraftChange?.('amount', e.target.value)}
              className="bg-white border-blue-300"
            />
            <Input
              placeholder="GST"
              readOnly
              value={(10 / 100) * Number(draft.amount || 0)}
              className="bg-white border-blue-300"
            />
            <Input
              placeholder="Discount"
              type="number"
              value={draft.discount}
              onChange={(e) => handleDraftChange?.('discount', e.target.value)}
              className="bg-white border-blue-300"
            />

            <Input
              placeholder="Net amount"
              value={draft.netamount}
              readOnly
              className="bg-green-50 border-green-300 font-semibold"
            />
            <Input
              placeholder="Invoice number"
              value={draft.invoicenumber}
              onChange={(e) => handleDraftChange?.('invoicenumber', e.target.value)}
              className="bg-green-50 border-blue-300"
            />

            <DatePicker
              value={draft.duedate ? new Date(draft.duedate) : undefined}
              onChange={(e) => handleDraftChange?.('duedate', e?.toISOString() || '')}
              side="top"
              placeholder="Due date"
              className="h-12 text-b2"
              disablePastDates={true}
            />

            <Select value={draft.status} onValueChange={(val) => handleDraftChange('status', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center mt-4 gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                // disabled={isPending}
              >
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <div>
        <Button
          type="button"
          onClick={handleAddRow}
          className="text-primary flex items-center gap-1 w-fit text-sm"
          variant="ghost"
        >
          <span>+ Add fee payment plan</span>
        </Button>
      </div>
    </TitleBox>
  );
};

export default Accounts;
