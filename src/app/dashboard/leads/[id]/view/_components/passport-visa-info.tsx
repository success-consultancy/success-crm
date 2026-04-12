import { InfoField } from '@/components/atoms/info-field';
import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type PassportVisaInfoProps = { lead: ILead };

const PassportVisaInfo = ({ lead }: PassportVisaInfoProps) => {
  return (
    <TitleBox title="Passport & visa info">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <InfoField title="Country" value={lead.country || 'N/A'} />
        <InfoField title="Visa" value={lead.visa || 'N/A'} />
        <InfoField title="Visa expiry date" value={lead.visaExpiry ? new Date(lead.visaExpiry).toLocaleDateString() : '-'} />
        <InfoField title="Passport number" value={lead.passport || 'N/A'} />
        <InfoField title="Issue date" value={lead.issueDate ? new Date(lead.issueDate).toLocaleDateString() : '-'} />
        <InfoField title="Expiry date" value={lead.expiryDate ? new Date(lead.expiryDate).toLocaleDateString() : '-'} />
      </div>
    </TitleBox>
  );
};

export default PassportVisaInfo;
