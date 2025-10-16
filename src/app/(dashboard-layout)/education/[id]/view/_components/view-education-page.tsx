'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import TabsMenu from './navigation-tabs';
import { EducationStages } from './education-stages';
import PersonalDetails from './personal-details';
import CourseInfo from './course-info';
import NoteSection from './note-section';
import Container from '@/components/atoms/container';
import { History } from './history';
import FollowUpList from './follow-up';
import { useGetEducationById } from '@/query/get-education';
import CourseFeeStructure from './course-fee-structure';
import Accounts from './accounts';
import { IAccounts, IFeePlan } from '@/types/response-types/education-response';
import MiscSection from './misc-section';

interface EducationPageContentProps {
  studentId: string;
}

const EducationPageContent: React.FC<EducationPageContentProps> = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'History', value: 'history' },
    { label: 'Follow-up', value: 'follow-up' },
  ];
  const { data: education, isLoading, isError } = useGetEducationById(studentId);

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
  } as IAccounts);

  // Extract accounts from education data using useMemo for performance
  const accounts = useMemo(() => {
    if (!education?.course_fees) return [];

    return education.course_fees
      .filter((fee) => fee.account) // Only include fees that have account data
      .map((fee) => fee.account as IAccounts);
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
  const calculateAccountsFromFee = useCallback((fee: IFeePlan): IAccounts => {
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
    };
  }, []);

  // Default draft objects - memoized to prevent recreation
  const defaultFeeDraft = useMemo(
    (): IFeePlan => ({
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
    (): IAccounts => ({
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
    (newFeeDraft: IFeePlan) => {
      setFeeDraft(newFeeDraft);

      if (isAddingRow) {
        const calculatedAccounts = calculateAccountsFromFee(newFeeDraft);
        // Preserve user-edited commission value, recalculate others
        const updatedAccountsDraft = {
          ...calculatedAccounts,
          comission: accountsDraft.comission || calculatedAccounts.comission, // Keep user input or use calculated
          discount: accountsDraft.discount || calculatedAccounts.discount,
          bonus: accountsDraft.bonus || calculatedAccounts.bonus,
          // Recalculate net amount based on current commission, discount, bonus
          netamount: String(
            Number(accountsDraft.comission || calculatedAccounts.comission) -
              Number(accountsDraft.discount || calculatedAccounts.discount) +
              Number(accountsDraft.bonus || calculatedAccounts.bonus),
          ),
        };
        setAccountsDraft(updatedAccountsDraft);
      }
    },
    [isAddingRow, calculateAccountsFromFee, accountsDraft],
  );

  // Handle accounts draft changes (for commission, discount, bonus edits) - memoized
  const handleAccountsDraftChange = useCallback(
    (field: keyof IAccounts, value: string) => {
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
        setAccountsDraft(initialAccounts);
      } else {
        // Reset drafts when canceling
        setFeeDraft(defaultFeeDraft);
        setAccountsDraft(defaultAccountsDraft);
      }
    },
    [calculateAccountsFromFee, feeDraft, defaultFeeDraft, defaultAccountsDraft],
  );

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">Loading...</div>;
  }
  if (isError || !education) {
    return <div className="flex justify-center items-center min-h-[300px] text-red-500">Education not found.</div>;
  }

  return (
    <Container className="flex flex-col py-10 gap-8 !p-6">
      <div className="bg-white rounded-lg p-4">
        <TabsMenu items={tabs} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <EducationStages education={education} />
              <PersonalDetails education={education} />
              <CourseInfo education={education} />
              <CourseFeeStructure
                courseFee={education.course_fees}
                studentId={education.id}
                isAdding={isAddingRow}
                onToggleAdding={handleToggleAdding}
                draft={feeDraft}
                onDraftChange={handleFeeDraftChange}
                accountsDraft={accountsDraft}
              />
              <Accounts
                courseFee={accounts}
                studentId={education.id}
                isAdding={isAddingRow}
                draft={accountsDraft}
                onDraftChange={handleAccountsDraftChange}
              />
              <MiscSection education={education} />
              <NoteSection education={education} />
            </div>
          )}
          {activeTab === 'history' && <History id={education.id.toString()} />}
          {activeTab === 'follow-up' && <FollowUpList id={education.id.toString()} />}
        </div>
      </div>
    </Container>
  );
};

export default EducationPageContent;
