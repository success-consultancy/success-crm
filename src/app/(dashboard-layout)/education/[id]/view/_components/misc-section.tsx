import { IEducation } from '@/types/response-types/education-response';
import TitleBox from './title-box';

type MiscSectionProps = { education: IEducation };

const MiscSection = ({ education }: MiscSectionProps) => {
  return (
    <TitleBox title="Misc Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Souce</span>
          <span className="text-gray-900 text-base font-medium">{education?.source?.name || '-'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Assigned To</span>
          <span className="text-gray-900 text-base font-medium">{education?.user?.firstName || '-'}</span>
        </div>
      </div>
    </TitleBox>
  );
};

export default MiscSection;
