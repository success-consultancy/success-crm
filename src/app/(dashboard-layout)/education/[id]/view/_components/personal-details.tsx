import { IEducation } from '@/types/response-types/education-response';
import TitleBox from './title-box';

type PersonalDetailsProps = { education: IEducation };

const PersonalDetails = ({ education }: PersonalDetailsProps) => {
  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">First name</span>
          <span className="text-gray-900 text-base font-medium">{education.firstName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Middle name</span>
          <span className="text-gray-900 text-base font-medium">{education.middleName || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Last name</span>
          <span className="text-gray-900 text-base font-medium">{education.lastName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Email address</span>
          <span className="text-gray-900 text-base font-medium">{education.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Phone number</span>
          <span className="text-gray-900 text-base font-medium">{education.phone || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Birth date</span>
          <span className="text-gray-900 text-base font-medium">
            {education.dob ? new Date(education.dob).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Nationality</span>
          <span className="text-gray-900 text-base font-medium">{education.country || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Address</span>
          <span className="text-gray-900 text-base font-medium">{education.address || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Passport number</span>
          <span className="text-gray-900 text-base font-medium">{education.passport || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Passport Issue date</span>
          <span className="text-gray-900 text-base font-medium">
            {education.issueDate ? new Date(education.issueDate).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Passport Expiry date</span>
          <span className="text-gray-900 text-base font-medium">
            {education.expiryDate ? new Date(education.expiryDate).toLocaleDateString() : '-'}
          </span>
        </div>
      </div>
    </TitleBox>
  );
};

export default PersonalDetails;
