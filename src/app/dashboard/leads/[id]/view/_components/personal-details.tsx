import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type Props = {
  lead: ILead;
};

const PersonalDetails = ({ lead }: Props) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">First name</span>
          <span className="text-gray-900 text-base font-medium">{lead.firstName || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Middle name</span>
          <span className="text-gray-900 text-base font-medium">{lead.middleName || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Last name</span>
          <span className="text-gray-900 text-base font-medium">{lead.lastName || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Email address</span>
          <span className="text-gray-900 text-base font-medium">{lead.email || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Phone number</span>
          <span className="text-gray-900 text-base font-medium">{lead.phone || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Birth date</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.dob)}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Address</span>
          <span className="text-gray-900 text-base font-medium">{lead.address || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Occupation</span>
          <span className="text-gray-900 text-base font-medium">{lead.occupation || 'N/A'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Location</span>
          <span className="text-gray-900 text-base font-medium">{lead.location || 'N/A'}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-800 text-sm">Qualification</span>
        <span className="text-gray-900 text-base font-medium block">{lead.qualification || 'N/A'}</span>
      </div>
    </TitleBox>
  );
};

export default PersonalDetails;
