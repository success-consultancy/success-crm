import { useMemo, useState, useCallback } from 'react';
import TitleBox from './title-box';
import TableComponent from '@/components/organisms/table';
import { useFeeStuructureColumn } from '@/config/columns/fee-structure-columns-definitions';
import { useAddCourseFee, useUpdateCourseFee, useDeleteCourseFee } from '@/mutations/education/course-fee';
import useAuthStore from '@/store/auth-store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { CreateAccountPayload } from '@/schema/account-schema';
import { CreateCourseFeePayload, IFeePlan } from '@/schema/education-schema';
import { DatePicker } from '@/components/organisms/date-picker';

// Column id → draft field mapping — stable module-level constant
const COLUMN_TO_FEE_KEY: Record<string, keyof CreateCourseFeePayload> = {
  planname: 'planname',
  'course-amount': 'amount',
  'course-due-date': 'duedate',
  'course-invoice-number': 'invoicenumber',
  'course-status': 'status',
  'course-note': 'note',
};

type CourseFeeStructureProps = {
  courseFee: IFeePlan[];
  studentId?: number;
  isAdding?: boolean;
  onToggleAdding?: (isAdding: boolean) => void;
  draft?: CreateCourseFeePayload;
  onDraftChange?: (draft: CreateCourseFeePayload) => void;
  accountsDraft?: CreateAccountPayload;
  onAccountsDraftChange?: (accountsDraft: CreateAccountPayload) => void;
  onEditingIdChange?: (feeId: number | null) => void;
  compType?: 'accordion';
};

const CourseFeeStructure = ({
  courseFee,
  studentId,
  isAdding = false,
  onToggleAdding,
  draft,
  onDraftChange,
  accountsDraft,
  onAccountsDraftChange,
  onEditingIdChange,
  compType,
}: CourseFeeStructureProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const { mutate: addCourseFee, isPending } = useAddCourseFee();
  const { mutate: updateCourseFee, isPending: isUpdating } = useUpdateCourseFee();
  const { mutate: deleteCourseFee } = useDeleteCourseFee();
  const user = useAuthStore((s) => s.profile);

  const isBusy = isPending || isUpdating;

  const handleEditRow = useCallback(
    (row: IFeePlan) => {
      const feeId = row?.id || null;
      setEditingId(feeId);
      onEditingIdChange?.(feeId);

      if (row.accounts && onAccountsDraftChange) {
        onAccountsDraftChange({
          planname: row.accounts.planname || '',
          amount: row.accounts.amount || '',
          duedate: row.accounts.duedate || '',
          invoicenumber: row.accounts.invoicenumber || '',
          status: row.accounts.status || 'Pending',
          comission: row.accounts.comission || '',
          discount: row.accounts.discount || '0',
          bonus: row.accounts.bonus || '0',
          netamount: row.accounts.netamount || '',
          accountableId: row.id ?? 0,  // course_fee.id — Account.accountableId references CourseFee
          accountableType: 'CourseFee',
        });
      }

      onDraftChange?.({ ...row, amount: row.amount as any });
    },
    [onDraftChange, onAccountsDraftChange, onEditingIdChange],
  );

  const handleDeleteRow = useCallback(
    (row: IFeePlan) => {
      if (!row.id) return;
      deleteCourseFee(row.id);
    },
    [deleteCourseFee],
  );

  const CourseFeeStrucutureColumns = useMemo(
    () => useFeeStuructureColumn({ onEdit: handleEditRow, editingId, onDelete: handleDeleteRow }),
    [handleEditRow, editingId, handleDeleteRow],
  );

  const handleAddRow = useCallback(() => {
    if (!studentId && !(user as any)?.id) return;
    onToggleAdding?.(true);
  }, [studentId, user, onToggleAdding]);

  const handleCancel = useCallback(() => {
    onToggleAdding?.(false);
    setEditingId(null);
    onEditingIdChange?.(null);
  }, [onToggleAdding, onEditingIdChange]);

  const handleSave = useCallback(() => {
    if (!studentId || !draft || !accountsDraft) return;

    const duedate = draft.duedate || new Date().toISOString().slice(0, 10);
    const { accountableId: _a, accountableType: _t, ...accountsData } = accountsDraft;

    const payload: CreateCourseFeePayload = {
      studentId: Number(studentId),
      planname: draft.planname || '',
      amount: draft.amount || '',
      duedate,
      invoicenumber: draft.invoicenumber || '',
      status: draft.status || 'Pending',
      note: draft.note || '',
      updatedBy: Number((user as any)?.id || 0),
      accounts: accountsData,
    };

    const onSuccess = () => {
      handleCancel();
      onDraftChange?.({ planname: '', amount: '', duedate: '', invoicenumber: '', status: 'Pending', note: '' } as IFeePlan);
    };

    if (editingId) {
      updateCourseFee({ id: editingId, payload }, { onSuccess });
    } else {
      addCourseFee(payload, { onSuccess });
    }
  }, [studentId, draft, accountsDraft, user, editingId, handleCancel, onDraftChange, updateCourseFee, addCourseFee]);

  const handleCellUpdate = useCallback(
    (row: IFeePlan, columnId: string, value: unknown) => {
      if (editingId == null || row.id !== editingId || !draft) return;
      const key = COLUMN_TO_FEE_KEY[columnId];
      if (!key) return;
      onDraftChange?.({ ...draft, [key]: value });
    },
    [editingId, draft, onDraftChange],
  );

  return (
    <Comp type={compType}>
      <div className="grid grid-cols-1 gap-y-2">
        <TableComponent
          data={courseFee || []}
          columns={CourseFeeStrucutureColumns}
          skeletonColumns={CourseFeeStrucutureColumns}
          isLoading={false}
          showPaginationSection={false}
          showHeaderSection={false}
          className="bg-neutral-white !text-neutral-darkGrey"
          onCellUpdate={handleCellUpdate}
          meta={{ editingId, draft }}
        />
        {/* Full add form when adding a new row */}
        {isAdding && draft && (
          <div className="grid grid-cols-[160px_120px_160px_128px_116px_200px] items-center gap-x-4 px-4 py-2 border-t">
            <Input
              placeholder="Plan name"
              value={draft.planname}
              onChange={(e) => onDraftChange?.({ ...draft, planname: e.target.value })}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={(draft.amount as any) ?? ''}
              onChange={(e) => onDraftChange?.({ ...draft, amount: e.target.value })}
            />
            <DatePicker
              value={draft.duedate ? new Date(draft.duedate) : undefined}
              onChange={(e) => onDraftChange?.({ ...draft, duedate: e?.toISOString() || '' })}
              side="top"
              placeholder="Due date"
              className="h-12 text-b2"
            />
            <Input
              placeholder="Invoice number"
              value={draft.invoicenumber}
              onChange={(e) => onDraftChange?.({ ...draft, invoicenumber: e.target.value })}
            />
            <Select
              defaultValue={draft.status}
              onValueChange={(val: any) => onDraftChange?.({ ...draft, status: val })}
            >
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
            <Input
              placeholder="Note"
              value={draft.note}
              onChange={(e) => onDraftChange?.({ ...draft, note: e.target.value })}
            />
            <div className="flex mt-4 items-center gap-2">
              <Button size="sm" onClick={handleSave} disabled={isBusy}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isBusy}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        {/* Save/Cancel bar when inline editing an existing row */}
        {editingId && !isAdding && draft && (
          <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30">
            <Button size="sm" onClick={handleSave} disabled={isBusy}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={isBusy}>
              Cancel
            </Button>
          </div>
        )}
        <Button
          type="button"
          onClick={handleAddRow}
          className="text-primary flex items-center gap-1 w-fit text-sm"
          disabled={isPending}
          variant="ghost"
        >
          <span>+ Add row</span>
        </Button>
      </div>
    </Comp>
  );
};

const Comp = ({ children, type }: { children: React.ReactNode; type?: 'accordion' }) => {
  if (type === 'accordion') {
    return (
      <FormAccordion value="item-3" title="Fee Structure">
        {children}
      </FormAccordion>
    );
  }

  return <TitleBox title="Course fee structure">{children}</TitleBox>;
};

export default CourseFeeStructure;
