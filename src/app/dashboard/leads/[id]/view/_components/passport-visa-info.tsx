import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type Props = {
  lead: ILead;
};

const PassportVisaInfo = ({ lead }: Props) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TitleBox title="Passport & visa info">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Country</span>
          <span className="text-gray-900 text-base font-medium">{lead.country || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Visa</span>
          <span className="text-gray-900 text-base font-medium">{lead.visa || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Visa expiry date</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.visaExpiry)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Passport number</span>
          <span className="text-gray-900 text-base font-medium">{lead.passport || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Issue date</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.issueDate)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Expiry date</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.expiryDate)}</span>
        </div>
      </div>
    </TitleBox>
  );
};

export default PassportVisaInfo;
