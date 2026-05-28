import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export interface ISetting {
  id: number;
  smsVisaExpiry: boolean;
  smsVisaExpiryNotificationDay: string | null;
  emailVisaExpiry: boolean;
  emailVisaExpiryNotificationDay: string | null;
  smsVisaRequestedDue: boolean;
  smsVisaRequestedDueNotificationDay: string | null;
  emailVisaRequestedDue: boolean;
  emailVisaRequestedDueNotificationDay: string | null;
  smsSkillRequestedDue: boolean;
  smsSkillRequestedDueNotificationDay: string | null;
  emailSkillRequestedDue: boolean;
  emailSkillRequestedDueNotificationDay: string | null;
  smsBirthday: boolean;
  emailBirthday: boolean;
  smsFeeDue: boolean;
  smsFeeDueNotificationDay: string | null;
  emailFeeDue: boolean;
  emailFeeDueNotificationDay: string | null;
  smsTaxNotice: boolean;
  smsTaxNoticeNotificationDay: string | null;
  emailTaxNotice: boolean;
  emailTaxNoticeNotificationDay: string | null;
  emailLeadFollowUp: boolean;
  emailLeadFollowUpNotificationDay: string | null;
  emailStudentFollowUp: boolean;
  emailStudentFollowUpNotificationDay: string | null;
  emailStudentFiscalReport: boolean;
  emailAatHearing?: boolean;
  emailAttHearingNotificationDay?: string | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const GET_SETTING = 'get-setting';

const DEFAULT_SETTING_ID = 1;

const getSetting = async (id: number) => {
  const res = await api.get(`/setting/${id}`);
  return res.data as ISetting;
};

export const useGetSetting = (id: number = DEFAULT_SETTING_ID) => {
  return useQuery({
    queryKey: [GET_SETTING, id],
    queryFn: () => getSetting(id),
    refetchOnWindowFocus: false,
  });
};
