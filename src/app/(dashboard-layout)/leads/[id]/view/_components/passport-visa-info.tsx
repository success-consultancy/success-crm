import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type PassportVisaInfoProps = { lead: ILead };

const PassportVisaInfo = ({ lead }: PassportVisaInfoProps) => {
  return (
    <TitleBox title="Passport & visa info">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Country</span>
          <span className="text-gray-900 text-base font-medium">{lead.country || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Visa</span>
          <span className="text-gray-900 text-base font-medium">{lead.visa || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Visa expiry</span>
          <span className="text-gray-900 text-base font-medium">
            {lead.visaExpiry ? new Date(lead.visaExpiry).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Passport</span>
          <span className="text-gray-900 text-base font-medium">{lead.passport || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Issue date</span>
          <span className="text-gray-900 text-base font-medium">
            {lead.issueDate ? new Date(lead.issueDate).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Expiry date</span>
          <span className="text-gray-900 text-base font-medium">
            {lead.expiryDate ? new Date(lead.expiryDate).toLocaleDateString() : '-'}
          </span>
        </div>
      </div>
    </TitleBox>
  );
};

export default PassportVisaInfo;
