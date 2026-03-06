import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Edit, MessageCircle } from 'lucide-react';
import StageItem from '@/components/organisms/stage-item';
import { useUpdateLeadStatus } from '@/mutations/leads/edit-lead';
import { ISkillAssessment, SkillAssessmentStatusTypes } from '@/types/response-types/skill-assessment-response';
import { useUpdateSkillStatus } from '@/mutations/skill-assessment/add-skill-assessment';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { useState } from 'react';

type SkillAssessmentStagesProps = { skillAssessment: ISkillAssessment };

export const SkillAssessmentStages = ({ skillAssessment }: SkillAssessmentStagesProps) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const stages = [
    { name: SkillAssessmentStatusTypes.NewApplicant, active: skillAssessment.status === SkillAssessmentStatusTypes.NewApplicant },
    { name: SkillAssessmentStatusTypes.CollectingDocs, active: skillAssessment.status === SkillAssessmentStatusTypes.CollectingDocs },
    { name: SkillAssessmentStatusTypes.ReadyToSubmit, active: skillAssessment.status === SkillAssessmentStatusTypes.ReadyToSubmit },
    { name: SkillAssessmentStatusTypes.Submitted, active: skillAssessment.status === SkillAssessmentStatusTypes.Submitted },
    { name: SkillAssessmentStatusTypes.InfoRequested, active: skillAssessment.status === SkillAssessmentStatusTypes.InfoRequested },
    { name: SkillAssessmentStatusTypes.Approved, active: skillAssessment.status === SkillAssessmentStatusTypes.Approved },
    { name: SkillAssessmentStatusTypes.Withdrawn, active: skillAssessment.status === SkillAssessmentStatusTypes.Withdrawn },
    { name: SkillAssessmentStatusTypes.Refused, active: skillAssessment.status === SkillAssessmentStatusTypes.Refused },
    { name: SkillAssessmentStatusTypes.Discontinued, active: skillAssessment.status === SkillAssessmentStatusTypes.Discontinued },
    { name: SkillAssessmentStatusTypes.FollowUp, active: skillAssessment.status === SkillAssessmentStatusTypes.FollowUp },
  ];

  const updateSkillStatus = useUpdateSkillStatus();

  const handleStageChange = (stage: string) => {
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;

    const payload = { id: skillAssessment.id.toString(), status: pendingStage }
    updateSkillStatus.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success('Skill updated successfully');
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;

          toast.error(message || 'Failed to update skill');
        },
      },
    );
  }


  return (
    <div className="border rounded-lg">
      <div className="border-b px-6 py-3 flex justify-between">
        <p className="text-xl font-bold">Skill assessment stages</p>

        <div className="flex gap-2">
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/skill/${skillAssessment.id}/edit`);
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
          >
            <Edit strokeWidth={1.5} className="h-5 w-5" />
            <span>Edit</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-accent-50 px-2 py-2 text-b1"
          >
            <MessageCircle strokeWidth={1.5} className="h-5 w-5" />
            <span>Send SMS</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-base font-medium">Start</p>
          <p className="text-sm text-gray-500">
            {skillAssessment.requestedDate
              ? new Date(skillAssessment.requestedDate).toLocaleDateString('en-GB')
              : '22/02/2025'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Closing</p>
          <p className="text-sm text-gray-500">
            {skillAssessment.dueDate ? new Date(skillAssessment.dueDate).toLocaleDateString('en-GB') : '-'}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-10">
        <div className="flex w-full">
          {(() => {
            const activeIndex = stages.findIndex((s) => s.active);
            return stages.map((stage, index) => (
              <StageItem
                key={stage.name}
                name={stage.name}
                active={stage.active}
                completed={activeIndex !== -1 && index < activeIndex}
                isFirst={index === 0}
                handleStageChange={handleStageChange}
              />
            ));
          })()}
        </div>

        <div className="flex gap-2 ml-4">
          <button className="px-4 py-2 rounded-md bg-green-100 text-green-700 font-medium">Won</button>
          <button className="px-4 py-2 rounded-md bg-red-100 text-red-700 font-medium">Lost</button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        title="Change Lead Stage"
        message={`Are you sure you want to change the lead stage to "${pendingStage}"?`}
        confirmText="Yes, change it"
        cancelText="Cancel"
        onConfirm={confirmStageChange}
        onCancel={() => setPendingStage(null)}
        loading={updateSkillStatus.isPending}
      />
    </div>
  );
};
