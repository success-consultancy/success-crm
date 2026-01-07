import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';
import { ITribunalReview } from '@/types/response-types/tribunal-review-response';

type PersonalDetailsProps = { visa: ITribunalReview };

const PersonalDetails = ({ visa }: PersonalDetailsProps) => {
  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-3 gap-6">
        <InfoField title="First name" value={visa.firstName} />
        <InfoField title="Middle name" value={visa.middleName || 'N/A'} />
        <InfoField title="Last name" value={visa.lastName} />
        <InfoField title="Date of birth" value={visa.dob ? new Date(visa.dob).toLocaleDateString() : '-'} />
        <InfoField title="Email address" value={visa.email} />
        <InfoField title="Phone number" value={visa.phone || '-'} />
        <InfoField title="Nationality" value={visa.country || '-'} />
        <InfoField title="Address" value={visa?.user?.address || '-'} />
        <InfoField title="Passport number" value={visa.passport || '-'} />
        <InfoField
          title="Passport issue date"
          value={visa.passportExpiryDate ? new Date(visa.passportExpiryDate).toLocaleDateString() : '-'}
        />
        <InfoField
          title="Passport expiry date"
          value={visa.passportExpiryDate ? new Date(visa.passportExpiryDate).toLocaleDateString() : '-'}
        />
        <InfoField title="Location" value={visa.location || '-'} />
      </div>
    </TitleBox>
  );
};

export default PersonalDetails;
