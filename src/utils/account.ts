import { CreateAccountPayload } from '@/mutations/visa/add-account';
import { IAccounts } from '@/types/response-types/education-response';

export const createEmptyDraft = (): CreateAccountPayload => ({
  planname: '',
  gst: '',
  amount: '',
  discount: '',
  netamount: '',
  duedate: '',
  invoicenumber: '',
  status: 'Pending',
});

export const calculateNetAmount = (amount: number, discount: number) => {
  const gst = amount * 0.1;
  return amount - discount + gst;
};

export const updateDraftField = (draft: IAccounts, key: keyof IAccounts, value: string): IAccounts => {
  const updatedDraft = {
    ...draft,
    [key]: value,
  };

  const amount = Number(updatedDraft.amount) || 0;
  const discount = Number(updatedDraft.discount) || 0;

  updatedDraft.netamount = calculateNetAmount(amount, discount).toFixed(2);

  return updatedDraft;
};

export const isDraftValid = (draft: IAccounts): boolean => {
  return Number(draft.amount) > 0 && Number(draft.netamount) > 0 && draft.planname.trim() !== '';
};

export const mapDraftToAccountRow = (draft: IAccounts): IAccounts => {
  const amount = draft.amount || '';
  const discount = draft.discount || '';

  return {
    ...draft,
    amount,
    discount,
    bonus: draft.bonus || '',
    comission: draft.comission || '',
    gst: (Number(amount) * 0.1).toString(),
    netamount: calculateNetAmount(Number(amount), Number(discount)).toFixed(2),
  };
};
