import { InfoField } from '@/components/atoms/info-field';
import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type PersonalDetailsProps = { lead: ILead };

const PersonalDetails = ({ lead }: PersonalDetailsProps) => {
  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">

        <InfoField title="First name" value={lead.firstName} />
        <InfoField title="Middle name" value={lead.middleName || 'N/A'} />
        <InfoField title="Last name" value={lead.lastName} />
        <InfoField title="Email address" value={lead.email} />
        <InfoField title="Phone number" value={lead.phone || 'N/A'} />
        <InfoField title="Birth date" value={lead.dob ? new Date(lead.dob).toLocaleDateString() : 'N/A'} />
        <InfoField title="Address" value={lead.address || 'N/A'} />
        <InfoField title="Occupation" value={lead.occupation || 'N/A'} />
        <InfoField title="ANZSCO" value={lead.anzsco || 'N/A'} />
        <InfoField title="Qualification" value={lead.qualification || 'N/A'} />
      </div>
    </TitleBox>
  );
};

export default PersonalDetails;
