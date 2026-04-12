import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type PersonalDetailsProps = { skillAssessment: ISkillAssessment };

const PersonalDetails = ({ skillAssessment }: PersonalDetailsProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return '-';
    }
  };

  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-3 gap-6">
        <InfoField title="First name" value={skillAssessment.firstName} />
        <InfoField title="Middle name" value={skillAssessment.middleName || 'N/A'} />
        <InfoField title="Last name" value={skillAssessment.lastName} />
        <InfoField title="Date of birth" value={formatDate(skillAssessment.dob)} />
        <InfoField title="Email address" value={skillAssessment.email} />
        <InfoField title="Phone number" value={skillAssessment.phone || '-'} />
        <InfoField title="Nationality" value={skillAssessment.country || '-'} />
        <InfoField title="Address" value={'-'} />
        <InfoField title="Passport number" value={skillAssessment.passport || '-'} />
        <InfoField title="Passport issue date" value={formatDate(skillAssessment.issueDate)} />
        <InfoField title="Passport expiry date" value={formatDate(skillAssessment.expiryDate)} />
        <InfoField title="Location" value={skillAssessment.location || '-'} />
      </div>
    </TitleBox>
  );
};

export default PersonalDetails;
