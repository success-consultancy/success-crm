import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import TitleBox from './title-box';

type MiscSectionProps = { skillAssessment: ISkillAssessment };

const MiscSection = ({ skillAssessment }: MiscSectionProps) => {
  return (
    <TitleBox title="Misc">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Source</span>
          <span className="text-gray-900 text-base font-medium">{skillAssessment?.source?.name || '-'}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Assigned To</span>
          <span className="text-gray-900 text-base font-medium">
            {skillAssessment?.user?.firstName || '-'}
          </span>
        </div>
      </div>
    </TitleBox>
  );
};

export default MiscSection;
