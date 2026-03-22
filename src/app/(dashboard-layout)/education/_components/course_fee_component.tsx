import { useCallback, useMemo, useState } from 'react';
import { useGetEducationById } from '@/query/get-education';
import { useUpdateAccount } from '@/mutations/account/add-account';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import CourseFeeStructure from '../[id]/view/_components/course-fee-structure';
import Accounts from '../[id]/view/_components/accounts';
import { CreateCourseFeePayload, IFeePlan } from '@/schema/education-schema';
import { CreateAccountPayload, IAccount } from '@/schema/account-schema';
import { ACCOUNTABLE_TYPE } from '@/types/common';

interface Props {
  id: string;
}

// Stable module-level constant — no accountableId/Type needed for reset
const DEFAULT_ACCOUNTS_DRAFT: CreateAccountPayload = {
  planname: '',
  amount: '',
  duedate: '',
  invoicenumber: '',
  status: 'Pending',
  comission: '',
  discount: '0',
  bonus: '0',
  netamount: '',
  accountableId: 0,
  accountableType: ACCOUNTABLE_TYPE.CourseFee,
};

const CourseFeeAndAccountsComponent = ({ id }: Props) => {
  const { data: education } = useGetEducationById(id);
  const queryClient = useQueryClient();
  const { mutate: updateAccount, isPending: isUpdatingAccount } = useUpdateAccount();

  // defaultFeeDraft depends on id prop — stable per component instance
  const defaultFeeDraft = useMemo(
    (): IFeePlan => ({
      planname: '',
      amount: '',
      duedate: '',
      invoicenumber: '',
      status: 'Pending',
      note: '',
      studentId: Number(id),
      id: 0,
    }),
    [id],
  );

  const [isAddingRow, setIsAddingRow] = useState(false);
  const [feeDraft, setFeeDraft] = useState<IFeePlan>(defaultFeeDraft);
  const [accountsDraft, setAccountsDraft] = useState<CreateAccountPayload>(DEFAULT_ACCOUNTS_DRAFT);
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null);
  const [editingAccountRowId, setEditingAccountRowId] = useState<number | null>(null);

  const accounts = useMemo(() => {
    if (!education?.course_fees) return [];
    return education.course_fees
      .filter((fee) => fee.accounts)
      .map((fee) => fee.accounts as IAccount);
  }, [education?.course_fees]);

  const editingAccountId = useMemo(() => {
    if (!editingFeeId || !education?.course_fees) return null;
    const fee = education.course_fees.find((f) => f.id === editingFeeId);
    return (fee?.accounts as IAccount)?.id ?? null;
  }, [editingFeeId, education?.course_fees]);

  const calculateAccountsFromFee = useCallback(
    (fee: CreateCourseFeePayload): CreateAccountPayload => {
      const amount = Number(fee.amount || 0);
      const commissionAmount = amount * 0.1; // 10% default commission
      return {
        planname: fee.planname || '',
        amount: String(amount),
        duedate: fee.duedate || '',
        invoicenumber: fee.invoicenumber || '',
        status: fee.status || 'Pending',
        comission: String(commissionAmount),
        discount: '0',
        bonus: '0',
        netamount: String(commissionAmount),
        accountableId: 0, // backend sets this to course_fee.id after create
        accountableType: ACCOUNTABLE_TYPE.CourseFee,
      };
    },
    [],
  );

  // Shared reset — called when cancelling add/edit
  const resetDrafts = useCallback(() => {
    setFeeDraft(defaultFeeDraft);
    setAccountsDraft(DEFAULT_ACCOUNTS_DRAFT);
  }, [defaultFeeDraft]);

  // Functional setState removes accountsDraft from deps, keeping this callback stable
  const handleFeeDraftChange = useCallback(
    (newFeeDraft: CreateCourseFeePayload) => {
      setFeeDraft(newFeeDraft as IFeePlan);
      if (isAddingRow || editingFeeId) {
        const calc = calculateAccountsFromFee(newFeeDraft);
        setAccountsDraft((prev) => ({
          ...calc,
          comission: prev.comission || calc.comission,
          discount: prev.discount || calc.discount,
          bonus: prev.bonus || calc.bonus,
          netamount: String(
            Number(prev.comission || calc.comission) -
              Number(prev.discount || calc.discount) +
              Number(prev.bonus || calc.bonus),
          ),
        }));
      }
    },
    [isAddingRow, editingFeeId, calculateAccountsFromFee],
  );

  // Functional setState removes accountsDraft from deps
  const handleAccountsDraftChange = useCallback(
    (field: keyof IAccount, value: string) => {
      if (!isAddingRow && !editingFeeId && !editingAccountRowId) return;
      setAccountsDraft((prev) => {
        const next = { ...prev, [field]: value };
        if (field === 'comission' || field === 'discount' || field === 'bonus') {
          const amount = Number(next.amount || '0');
          const com = Number(next.comission || '0');
          const discount = Number(next.discount || '0');
          const bonus = Number(next.bonus || '0');
          if (isNaN(amount) || isNaN(com) || isNaN(discount) || isNaN(bonus)) {
            console.warn('Invalid numeric value detected in accounts calculation');
            return prev;
          }
          next.netamount = String(amount * (com / 100) - discount + bonus);
        }
        return next;
      });
    },
    [isAddingRow, editingFeeId, editingAccountRowId],
  );

  const handleStartEditAccount = useCallback((accountId: number, draft: CreateAccountPayload) => {
    setEditingAccountRowId(accountId);
    setAccountsDraft(draft);
  }, []);

  const handleCancelEditAccount = useCallback(() => {
    setEditingAccountRowId(null);
    setAccountsDraft(DEFAULT_ACCOUNTS_DRAFT);
  }, []);

  const handleSaveAccount = useCallback(
    (accountId: number, payload: CreateAccountPayload) => {
      updateAccount(
        { id: accountId, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_EDUCATION_BY_ID, id] });
            setEditingAccountRowId(null);
            setAccountsDraft(DEFAULT_ACCOUNTS_DRAFT);
          },
        },
      );
    },
    [updateAccount, queryClient, id],
  );

  const handleToggleAdding = useCallback(
    (adding: boolean) => {
      setIsAddingRow(adding);
      if (adding) {
        setAccountsDraft(calculateAccountsFromFee(feeDraft));
      } else {
        resetDrafts();
        setEditingFeeId(null);
      }
    },
    [calculateAccountsFromFee, feeDraft, resetDrafts],
  );

  const handleEditingFeeIdChange = useCallback(
    (feeId: number | null) => {
      setEditingFeeId(feeId);
      if (!feeId) resetDrafts();
    },
    [resetDrafts],
  );

  return (
    <>
      <CourseFeeStructure
        courseFee={education?.course_fees || []}
        studentId={education?.id}
        isAdding={isAddingRow}
        onToggleAdding={handleToggleAdding}
        draft={feeDraft}
        compType="accordion"
        onDraftChange={handleFeeDraftChange}
        accountsDraft={accountsDraft}
        onAccountsDraftChange={setAccountsDraft}
        onEditingIdChange={handleEditingFeeIdChange}
      />
      <Accounts
        courseFee={accounts}
        studentId={education?.id}
        isAdding={isAddingRow}
        editingFeeId={editingFeeId}
        editingAccountId={editingAccountId}
        editingAccountRowId={editingAccountRowId}
        draft={accountsDraft}
        onDraftChange={handleAccountsDraftChange}
        onStartEditAccount={handleStartEditAccount}
        onCancelEditAccount={handleCancelEditAccount}
        onSaveAccount={handleSaveAccount}
        isSavingAccount={isUpdatingAccount}
        compType="accordion"
      />
    </>
  );
};

export default CourseFeeAndAccountsComponent;
