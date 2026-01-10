import React, { useCallback, useMemo, useState } from 'react';
import { useGetEducationById } from '@/query/get-education';
import CourseFeeStructure from '../[id]/view/_components/course-fee-structure';
import Accounts from '../[id]/view/_components/accounts';
import { IFeePlan } from '@/schema/education-schema';
import { CreateAccountPayload, IAccount } from '@/schema/account-schema';
import { ACCOUNTABLE_TYPE } from '@/types/common';

interface Props {
  id: string;
}
const CourseFeeAndAccountsComponent = ({ id }: Props) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'History', value: 'history' },
    { label: 'Follow-up', value: 'follow-up' },
  ];
  const { data: education, isLoading, isError } = useGetEducationById(id);

  // Shared state for adding rows
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [feeDraft, setFeeDraft] = useState({
    planname: '',
    amount: '',
    duedate: '',
    invoicenumber: '',
    status: 'Pending',
    note: '',
  } as IFeePlan);
  const [accountsDraft, setAccountsDraft] = useState({
    planname: '',
    amount: '',
    duedate: '',
    invoicenumber: '',
    status: 'Pending',
    comission: '',
    discount: '0',
    bonus: '0',
    netamount: '',
  } as IAccount);

  // Extract accounts from education data using useMemo for performance
  const accounts = useMemo(() => {
    if (!education?.course_fees) return [];

    return education.course_fees
      .filter((fee) => fee.accounts) // Only include fees that have account data
      .map((fee) => fee.accounts as IAccount);
  }, [education?.course_fees]);

  // Calculate summary statistics for accounts - memoized for performance
  const accountsSummary = useMemo(() => {
    if (accounts.length === 0) {
      return {
        totalAmount: 0,
        totalCommission: 0,
        totalNetAmount: 0,
        pendingCount: 0,
        paidCount: 0,
      };
    }

    return accounts.reduce(
      (summary, account) => {
        const amount = Number(account.amount) || 0;
        const commission = Number(account.comission) || 0;
        const netAmount = Number(account.netamount) || 0;

        return {
          totalAmount: summary.totalAmount + amount,
          totalCommission: summary.totalCommission + commission,
          totalNetAmount: summary.totalNetAmount + netAmount,
          pendingCount: summary.pendingCount + (account.status === 'Pending' ? 1 : 0),
          paidCount: summary.paidCount + (account.status === 'Paid' ? 1 : 0),
        };
      },
      {
        totalAmount: 0,
        totalCommission: 0,
        totalNetAmount: 0,
        pendingCount: 0,
        paidCount: 0,
      },
    );
  }, [accounts]);

  // Helper function to calculate accounts from fee data - memoized for performance
  const calculateAccountsFromFee = useCallback((fee: IFeePlan): CreateAccountPayload => {
    const amountNum = Number(fee.amount || 0);

    // TODO: Get college commission percentage from university/college data
    // For now using a default commission percentage (e.g., 10%)
    const collegeCommissionPercentage = 10; // This should come from college/university data

    // Commission Amount = Instalment 1(fee) * college commission %
    const commissionAmount = amountNum * (collegeCommissionPercentage / 100);

    // Default values for discount and bonus (can be made configurable)
    const discountNum = 0; // default discount
    const bonusNum = 0; // default bonus

    // Net Amount = Commission Amount - Discount + Bonus
    const netAmountNum = commissionAmount - discountNum + bonusNum;

    return {
      planname: fee.planname || '',
      amount: String(amountNum),
      duedate: fee.duedate || '',
      invoicenumber: fee.invoicenumber || '',
      status: fee.status || 'Pending',
      comission: String(commissionAmount),
      discount: String(discountNum),
      bonus: String(bonusNum),
      netamount: String(netAmountNum),
      accountableId: education?.id || 0,
      accountableType: ACCOUNTABLE_TYPE.CourseFee,
    };
  }, []);

  // Default draft objects - memoized to prevent recreation
  const defaultFeeDraft = useMemo(
    (): Partial<IFeePlan> => ({
      planname: '',
      amount: '',
      duedate: '',
      invoicenumber: '',
      status: 'Pending',
      note: '',
    }),
    [],
  );

  const defaultAccountsDraft = useMemo(
    (): Partial<IAccount> => ({
      planname: '',
      amount: '',
      duedate: '',
      invoicenumber: '',
      status: 'Pending',
      comission: '',
      discount: '0',
      bonus: '0',
      netamount: '',
    }),
    [],
  );

  // Handle fee draft changes and update accounts draft accordingly - memoized
  const handleFeeDraftChange = useCallback(
    (newFeeDraft: Partial<IFeePlan>) => {
      const updatedFeeDraft: IFeePlan = {
        ...feeDraft,
        ...newFeeDraft,
        planname: newFeeDraft.planname ?? feeDraft.planname,
        amount: newFeeDraft.amount ?? feeDraft.amount,
        duedate: newFeeDraft.duedate ?? feeDraft.duedate,
        invoicenumber: newFeeDraft.invoicenumber ?? feeDraft.invoicenumber,
        status: newFeeDraft.status ?? feeDraft.status,
        note: newFeeDraft.note ?? feeDraft.note,
        id: newFeeDraft.id ?? feeDraft.id,
      };
      setFeeDraft(updatedFeeDraft);

      if (isAddingRow) {
        const calculatedAccounts = calculateAccountsFromFee(updatedFeeDraft);
        // Preserve user-edited commission value, recalculate others
        const updatedAccountsDraft: IAccount = {
          planname: calculatedAccounts.planname || accountsDraft.planname || '',
          amount: calculatedAccounts.amount || accountsDraft.amount || '',
          duedate: calculatedAccounts.duedate || accountsDraft.duedate || '',
          invoicenumber: calculatedAccounts.invoicenumber || accountsDraft.invoicenumber || '',
          status: calculatedAccounts.status || accountsDraft.status || 'Pending',
          comission: accountsDraft.comission || calculatedAccounts.comission || '', // Keep user input or use calculated
          discount: accountsDraft.discount || calculatedAccounts.discount || '0',
          bonus: accountsDraft.bonus || calculatedAccounts.bonus || '0',
          // Recalculate net amount based on current commission, discount, bonus
          netamount: String(
            Number(accountsDraft.comission || calculatedAccounts.comission || '0') -
              Number(accountsDraft.discount || calculatedAccounts.discount || '0') +
              Number(accountsDraft.bonus || calculatedAccounts.bonus || '0'),
          ),
          accountableId: calculatedAccounts.accountableId || education?.id || 0,
          accountableType: calculatedAccounts.accountableType || ACCOUNTABLE_TYPE.CourseFee,
          id: accountsDraft.id || 0,
        };
        setAccountsDraft(updatedAccountsDraft);
      }
    },
    [isAddingRow, calculateAccountsFromFee, accountsDraft, feeDraft],
  );

  // Handle accounts draft changes (for commission, discount, bonus edits) - memoized
  const handleAccountsDraftChange = useCallback(
    (field: keyof IAccount, value: string) => {
      if (!isAddingRow) return;

      const updatedAccountsDraft = {
        ...accountsDraft,
        [field]: value,
      };

      // Recalculate net amount when commission, discount, or bonus changes
      if (field === 'comission' || field === 'discount' || field === 'bonus') {
        const amountNum = Number(updatedAccountsDraft.amount || '0');
        const comPct = Number(updatedAccountsDraft.comission || '0');
        const discountNum = Number(updatedAccountsDraft.discount || '0');
        const bonusNum = Number(updatedAccountsDraft.bonus || '0');

        // Validate numeric values before calculation
        if (isNaN(amountNum) || isNaN(comPct) || isNaN(discountNum) || isNaN(bonusNum)) {
          console.warn('Invalid numeric value detected in accounts calculation');
          return;
        }

        const commissionAmount = amountNum * (comPct / 100);
        updatedAccountsDraft.netamount = String(commissionAmount - discountNum + bonusNum);
      }

      setAccountsDraft(updatedAccountsDraft);
    },
    [isAddingRow, accountsDraft],
  );

  // Initialize accounts draft when starting to add row - memoized
  const handleToggleAdding = useCallback(
    (adding: boolean) => {
      setIsAddingRow(adding);
      if (adding) {
        const initialAccounts = calculateAccountsFromFee(feeDraft);
        const completeAccounts: IAccount = {
          planname: initialAccounts.planname || '',
          amount: initialAccounts.amount || '',
          duedate: initialAccounts.duedate || '',
          invoicenumber: initialAccounts.invoicenumber || '',
          status: initialAccounts.status || 'Pending',
          comission: initialAccounts.comission || '',
          discount: initialAccounts.discount || '0',
          bonus: initialAccounts.bonus || '0',
          netamount: initialAccounts.netamount || '',
          accountableId: initialAccounts.accountableId || 0,
          accountableType: initialAccounts.accountableType || ACCOUNTABLE_TYPE.CourseFee,
          id: 0,
        };
        setAccountsDraft(completeAccounts);
      } else {
        // Reset drafts when canceling
        const resetFeeDraft: IFeePlan = {
          planname: defaultFeeDraft.planname || '',
          amount: defaultFeeDraft.amount || '',
          duedate: defaultFeeDraft.duedate || '',
          invoicenumber: defaultFeeDraft.invoicenumber || '',
          status: defaultFeeDraft.status || 'Pending',
          note: defaultFeeDraft.note || '',
          studentId: education?.id || 0,
          id: 0,
        };
        const resetAccountsDraft: IAccount = {
          planname: defaultAccountsDraft.planname || '',
          amount: defaultAccountsDraft.amount || '',
          duedate: defaultAccountsDraft.duedate || '',
          invoicenumber: defaultAccountsDraft.invoicenumber || '',
          status: defaultAccountsDraft.status || 'Pending',
          comission: defaultAccountsDraft.comission || '',
          discount: defaultAccountsDraft.discount || '0',
          bonus: defaultAccountsDraft.bonus || '0',
          netamount: defaultAccountsDraft.netamount || '',
          id: 0,
          accountableId: defaultAccountsDraft.accountableId || 0,
          accountableType: defaultAccountsDraft.accountableType || ACCOUNTABLE_TYPE.CourseFee,
        };
        setFeeDraft(resetFeeDraft);
        setAccountsDraft(resetAccountsDraft);
      }
    },
    [calculateAccountsFromFee, feeDraft, defaultFeeDraft, defaultAccountsDraft],
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
      />
      <Accounts
        courseFee={accounts}
        studentId={education?.id}
        isAdding={isAddingRow}
        draft={accountsDraft}
        onDraftChange={handleAccountsDraftChange}
        compType="accordion"
      />
    </>
  );
};

export default CourseFeeAndAccountsComponent;
