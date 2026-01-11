import { ISkillAssessment } from '@/types/response-types/skill-assessment-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type VisaServiceDetailsProps = { skillAssessment: ISkillAssessment };

const VisaServiceDetails = ({ skillAssessment }: VisaServiceDetailsProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return 'N/A';
    }
  };

  const assessmentBody = skillAssessment.skillAssessmentBody === 'Other' 
    ? skillAssessment.otherSkillAssessmentBody 
    : skillAssessment.skillAssessmentBody;

  const occupationDisplay = skillAssessment.anzsco && skillAssessment.occupation
    ? `${skillAssessment.anzsco} - ${skillAssessment.occupation}`
    : skillAssessment.occupation || skillAssessment.anzsco || '-';

  return (
    <TitleBox title="Visa & service details">
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <InfoField title="Current visa" value={skillAssessment.currentVisa || '-'} />
          <InfoField title="Visa expiry date" value={formatDate(skillAssessment.visaExpiry)} />
          <InfoField title="Due date" value={formatDate(skillAssessment.dueDate)} />
          <InfoField title="Occupation" value={occupationDisplay} />
          <InfoField title="Assessment authority" value={assessmentBody || '-'} />
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <InfoField title="Date submitted" value={formatDate(skillAssessment.submittedDate)} />
          <InfoField title="Decision date" value={formatDate(skillAssessment.decisionDate)} />
          <InfoField title="SBS/TAS status" value={skillAssessment.csaStatus || '-'} />
          <InfoField title="Status" value={skillAssessment.status || '-'} />
        </div>
      </div>
    </TitleBox>
  );
};

export default VisaServiceDetails;
