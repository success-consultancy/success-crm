import { useMemo, useState, useCallback } from 'react';
import TitleBox from './title-box';
import TableComponent from '@/components/organisms/table';
import { useFeeStuructureColumn } from '@/config/columns/fee-structure-columns-definitions';
import { useAddCourseFee, useUpdateCourseFee } from '@/mutations/education/add-course-fee';
import useAuthStore from '@/store/auth-store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';
import { CreateAccountPayload } from '@/schema/account-schema';
import { CreateCourseFeePayload, IFeePlan } from '@/schema/education-schema';
import { ACCOUNTABLE_TYPE } from '@/types/common';
import { DatePicker } from '@/components/organisms/date-picker';

type CourseFeeStructureProps = {
  courseFee: IFeePlan[];
  studentId?: number;
  isAdding?: boolean;
  onToggleAdding?: (isAdding: boolean) => void;
  draft?: CreateCourseFeePayload;
  onDraftChange?: (draft: CreateCourseFeePayload) => void;
  accountsDraft?: any;
  onAccountsDraftChange?: (accountsDraft: any) => void;
  onEditingIdChange?: (feeId: number | null) => void;
  compType?: string;
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
  const handleEditRow = useCallback(
    (row: IFeePlan) => {
      const feeId = row?.id || null;
      setEditingId(feeId);
      // Set editing ID in parent first so handleFeeDraftChange knows we're editing
      onEditingIdChange?.(feeId);

      // Update accounts draft when editing - use existing account data if available
      // If account doesn't exist, parent will calculate it from fee data
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
        });
      }

      // Update fee draft - this will trigger handleFeeDraftChange in parent
      // which will calculate accounts if they don't exist
      onDraftChange?.({
        ...row,
        amount: row.amount as any,
      });
    },
    [onDraftChange, onAccountsDraftChange, onEditingIdChange],
  );
  const CourseFeeStrucutureColumns = useMemo(
    () => useFeeStuructureColumn({ onEdit: handleEditRow, editingId }),
    [handleEditRow, editingId],
  );
  const { mutate: addCourseFee, isPending } = useAddCourseFee();
  const { mutate: updateCourseFee, isPending: isUpdating } = useUpdateCourseFee();
  const user = useAuthStore((s) => s.profile);

  const handleAddRow = () => {
    if (!studentId && !(user as any)?.id) {
      return;
    }
    onToggleAdding?.(true);
  };

  const handleSave = () => {
    if (!studentId || !draft || !accountsDraft) return;
    const duedate = draft.duedate || new Date().toISOString().slice(0, 10);

    // Use accounts draft data (with user-edited commission, discount, bonus)
    const accountsData = {
      planname: accountsDraft.planname,
      amount: accountsDraft.amount,
      duedate: accountsDraft.duedate,
      invoicenumber: accountsDraft.invoicenumber,
      status: accountsDraft.status,
      comission: accountsDraft.comission,
      discount: accountsDraft.discount,
      bonus: accountsDraft.bonus,
      netamount: accountsDraft.netamount,
    };

    if (editingId) {
      updateCourseFee(
        {
          id: editingId,
          payload: {
            studentId: Number(studentId),
            planname: draft.planname || '',
            amount: draft.amount || '',
            duedate: duedate,
            invoicenumber: draft.invoicenumber || '',
            status: draft.status || 'Pending',
            note: draft.note || '',
            updatedBy: Number((user as any)?.id || 0),
            accounts: accountsData as CreateAccountPayload,
          },
        },
        {
          onSuccess: () => {
            onToggleAdding?.(false);
            setEditingId(null);
            onEditingIdChange?.(null);
            onDraftChange?.({
              planname: '',
              amount: '',
              duedate: '',
              invoicenumber: '',
              status: 'Pending',
              note: '',
            } as IFeePlan);
          },
        },
      );
    } else {
      addCourseFee(
        {
          studentId: Number(studentId),
          planname: draft.planname || '',
          amount: draft.amount || '',
          duedate,
          invoicenumber: draft.invoicenumber || '',
          status: draft.status || 'Pending',
          note: draft.note || '',
          updatedBy: Number((user as any)?.id || 0),
          accounts: accountsData,
        },
        {
          onSuccess: () => {
            onToggleAdding?.(false);
            setEditingId(null);
            onEditingIdChange?.(null);
            onDraftChange?.({
              planname: '',
              amount: '',
              duedate: '',
              invoicenumber: '',
              status: 'Pending',
              note: '',
            } as IFeePlan);
          },
        },
      );
    }
  };

  const handleCancel = () => {
    onToggleAdding?.(false);
    setEditingId(null);
    onEditingIdChange?.(null);
  };

  const columnIdToDraftKey: Record<string, keyof CreateCourseFeePayload> = {
    planname: 'planname',
    'course-amount': 'amount',
    'course-due-date': 'duedate',
    'course-invoice-number': 'invoicenumber',
    'course-status': 'status',
    'course-note': 'note',
  };

  const handleCellUpdate = (row: IFeePlan, columnId: string, value: unknown) => {
    if (editingId == null || (row as IFeePlan).id !== editingId || !draft) return;
    const key = columnIdToDraftKey[columnId];
    if (!key) return;
    const nextDraft = { ...draft, [key]: value };
    onDraftChange?.(nextDraft);
  };

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
              <Button size="sm" onClick={handleSave} disabled={isPending || isUpdating}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isPending || isUpdating}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        {/* Save/Cancel bar when inline editing an existing row */}
        {editingId && !isAdding && draft && (
          <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30">
            <Button size="sm" onClick={handleSave} disabled={isPending || isUpdating}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={isPending || isUpdating}>
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

export default CourseFeeStructure;
