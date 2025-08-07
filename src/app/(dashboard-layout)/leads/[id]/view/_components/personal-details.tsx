import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type PersonalDetailsProps = { lead: ILead };

const PersonalDetails = ({ lead }: PersonalDetailsProps) => {
  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">First name</span>
          <span className="text-gray-900 text-base font-medium">{lead.firstName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Middle name</span>
          <span className="text-gray-900 text-base font-medium">{lead.middleName || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Last name</span>
          <span className="text-gray-900 text-base font-medium">{lead.lastName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Email address</span>
          <span className="text-gray-900 text-base font-medium">{lead.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Phone number</span>
          <span className="text-gray-900 text-base font-medium">{lead.phone || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Birth date</span>
          <span className="text-gray-900 text-base font-medium">
            {lead.dob ? new Date(lead.dob).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Address</span>
          <span className="text-gray-900 text-base font-medium">{lead.address || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Occupation</span>
          <span className="text-gray-900 text-base font-medium">{lead.occupation || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Qualification</span>
          <span className="text-gray-900 text-base font-medium">{lead.qualification || '-'}</span>
        </div>
      </div>
    </TitleBox>
  );
};

export default PersonalDetails;
