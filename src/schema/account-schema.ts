export interface IAccount {
  id: number;
  accountableId: number;
  accountableType: string;
  planname: string;
  amount: string;
  duedate: string;
  invoicenumber?: string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Other';
  comission?: string;
  discount?: string;
  bonus?: string;
  netamount?: string;
  gst?: string;
  updatedBy?: number;
  feeNote?: string;
}

export type CreateAccountPayload = Omit<IAccount, 'id'>;
