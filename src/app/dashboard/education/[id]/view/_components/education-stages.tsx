import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';
import StageItem from '@/components/organisms/stage-item';
import { useUpdateEducationStatus } from '@/mutations/education/add-education';
import { EducationStatusTypes, IEducation } from '@/types/response-types/education-response';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { useState } from 'react';
import { ENTITY, toastMsg } from '@/constants/messages';

type EducationStagesProps = { education: IEducation };
export const EducationStages = ({ education }: EducationStagesProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const stages = [
    { name: EducationStatusTypes.New, active: education.status === EducationStatusTypes.New },
    { name: EducationStatusTypes.Checklist, active: education.status === EducationStatusTypes.Checklist },
    { name: EducationStatusTypes.ApplicationReady, active: education.status === EducationStatusTypes.ApplicationReady },
    {
      name: EducationStatusTypes.ApplicationSubmitted,
      active: education.status === EducationStatusTypes.ApplicationSubmitted,
    },
    { name: EducationStatusTypes.OfferReceived, active: education.status === EducationStatusTypes.OfferReceived },
    { name: EducationStatusTypes.WaitingPayment, active: education.status === EducationStatusTypes.WaitingPayment },
    { name: EducationStatusTypes.FeePaid, active: education.status === EducationStatusTypes.FeePaid },
    { name: EducationStatusTypes.CoeReceived, active: education.status === EducationStatusTypes.CoeReceived },
  ];

  const updateStatus = useUpdateEducationStatus();

  const handleStageChange = (stage: string) => {
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;

    const payload = { id: education.id.toString(), status: pendingStage };
    updateStatus.mutate(payload, {
      onSuccess: () => {
        toast.success(toastMsg.updateSuccess(ENTITY.education));
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        toast.error(message || toastMsg.updateError(ENTITY.education));
      },
    });
  };

  return (
    <div className="border rounded-lg shadow-sm ">
      <div className="border-b px-6 py-3 flex justify-between items-center">
        <p className="text-xl font-bold">Education stages</p>
      </div>

      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-base font-medium">Start</p>
          <p className="text-sm text-gray-500">22/02/2025</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Closing</p>
          <p className="text-sm text-gray-500">-</p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-10">
        <div className="hide-scrollbar flex min-w-0 flex-1 overflow-x-auto">
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

        <ConfirmationDialog
          isOpen={confirmOpen}
          setIsOpen={setConfirmOpen}
          title="Change Education Stage"
          message={`Are you sure you want to change the education stage to "${pendingStage}"?`}
          confirmText="Yes, change it"
          cancelText="Cancel"
          onConfirm={confirmStageChange}
          onCancel={() => setPendingStage(null)}
          loading={updateStatus.isPending}
        />
      </div>
    </div>
  );
};
