import { useMemo, useState } from 'react';
import TitleBox from './title-box';
import { ColumnDef } from '@tanstack/react-table';
import TableComponent from '@/components/organisms/table';
import { IEducation, IFeePlan } from '@/types/response-types/education-response';
import { useFeeStuructureColumn } from '@/config/columns/fee-structure-columns-definitions';
import { useAddCourseFee } from '@/mutations/education/add-course-fee';
import useAuthStore from '@/store/auth-store';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/atoms/button';
import { FormAccordion } from '@/components/organisms/form-accordion';

type CourseFeeStructureProps = {
  courseFee: IFeePlan[];
  studentId?: number;
  isAdding?: boolean;
  onToggleAdding?: (isAdding: boolean) => void;
  draft?: IFeePlan;
  onDraftChange?: (draft: IFeePlan) => void;
  accountsDraft?: any; // IAccounts type
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
  compType,
}: CourseFeeStructureProps) => {
  const CourseFeeStrucutureColumns = useFeeStuructureColumn();

  const [visibleColumns, setVisibleColumns] = useState<ColumnDef<IFeePlan>[]>(CourseFeeStrucutureColumns);
  const { mutate: addCourseFee, isPending } = useAddCourseFee();
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

    addCourseFee(
      {
        studentId: Number(studentId),
        planname: draft.planname,
        amount: Number(draft.amount || 0),
        duedate,
        invoicenumber: draft.invoicenumber,
        status: draft.status,
        note: draft.note,
        updatedBy: Number((user as any)?.id || 0),
        accounts: accountsData,
      },
      {
        onSuccess: () => {
          onToggleAdding?.(false);
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
  };

  const handleCancel = () => {
    onToggleAdding?.(false);
  };

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
        {isAdding && draft && (
          <div className="grid grid-cols-[160px_160px_160px_128px_216px_1fr] items-center gap-x-4 px-4 py-2 border-t">
            <Input
              placeholder="Plan name"
              value={draft.planname}
              onChange={(e) => onDraftChange?.({ ...draft, planname: e.target.value })}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={(draft.amount as any) ?? ''}
              onChange={(e) => onDraftChange?.({ ...draft, amount: Number(e.target.value) as any })}
            />
            <Input
              placeholder="Due date"
              type="date"
              value={draft.duedate}
              onChange={(e) => onDraftChange?.({ ...draft, duedate: e.target.value })}
            />
            <Input
              placeholder="Invoice number"
              value={draft.invoicenumber}
              onChange={(e) => onDraftChange?.({ ...draft, invoicenumber: e.target.value })}
            />
            <Select defaultValue={draft.status} onValueChange={(val) => onDraftChange?.({ ...draft, status: val })}>
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
            <div className="flex items-center gap-2">
              <Input
                placeholder="Note"
                value={draft.note}
                onChange={(e) => onDraftChange?.({ ...draft, note: e.target.value })}
              />
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
            </div>
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
  if (type === "accordion") {
    return <FormAccordion value="item-3" title="Fee Structure">{children}</FormAccordion>;
  }
  
  return <TitleBox title="Course fee structure">{children}</TitleBox>;
};

export default CourseFeeStructure;
