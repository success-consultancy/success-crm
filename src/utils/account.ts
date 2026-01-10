import { CreateAccountPayload, IAccount } from '@/schema/account-schema';

export const createEmptyDraft = (): CreateAccountPayload => ({
  planname: '',
  gst: '',
  amount: '',
  discount: '',
  netamount: '',
  duedate: '',
  invoicenumber: '',
  status: 'Pending',
  accountableId: 0,
  accountableType: '',
});

export const calculateNetAmount = (amount: number, discount: number) => {
  const gst = amount * 0.1;
  return amount - discount + gst;
};

export const updateDraftField = (
  draft: CreateAccountPayload,
  key: keyof CreateAccountPayload,
  value: string,
): CreateAccountPayload => {
  const updatedDraft = {
    ...draft,
    [key]: value,
  };

  const amount = Number(updatedDraft.amount) || 0;
  const discount = Number(updatedDraft.discount) || 0;

  updatedDraft.netamount = calculateNetAmount(amount, discount).toFixed(2);

  return updatedDraft;
};

export const isDraftValid = (draft: IAccount): boolean => {
  return Number(draft.amount) > 0 && Number(draft.netamount) > 0 && draft.planname.trim() !== '';
};

export const mapDraftToAccountRow = (draft: IAccount): IAccount => {
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
