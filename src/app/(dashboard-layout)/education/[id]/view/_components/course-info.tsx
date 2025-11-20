import { IEducation } from '@/types/response-types/education-response';
import TitleBox from './title-box';

type CourseInfoProps = { education: IEducation };

const PassportVisaInfo = ({ education }: CourseInfoProps) => {
  return (
    <TitleBox title="Course Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-b3-b">University name</span>
          <span className="text-neutral-dark-grey text-base font-medium">{education?.university?.name || '-'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-b3-b">Course</span>
          <span className="text-neutral-dark-grey text-base font-medium">{education?.course?.name || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-b3-b">University start date</span>
          <span className="text-neutral-dark-grey text-base font-medium">
            {education.startDate ? new Date(education.startDate).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-b3-b">University end date</span>
          <span className="text-neutral-dark-grey text-base font-medium">
            {education.endDate ? new Date(education.endDate).toLocaleDateString() : '-'}
          </span>
        </div>
      </div>
    </TitleBox>
  );
};

export default PassportVisaInfo;
