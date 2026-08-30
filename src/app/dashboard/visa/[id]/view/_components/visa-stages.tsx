import { cn } from '@/lib/utils';
import { IVisa, IVisaDetail, VisaStatusTypes } from '@/types/response-types/visa-response';
import StageItem from '@/components/organisms/stage-item';
import toast from 'react-hot-toast';
import { useUpdateVisaStatus } from '@/mutations/visa/add-visa';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { useState } from 'react';
import { ENTITY, toastMsg } from '@/constants/messages';

type VisaStagesProps = { visa: IVisaDetail };

export const VisaStages = ({ visa }: VisaStagesProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const stages = [
    { name: VisaStatusTypes.New, active: visa.status === VisaStatusTypes.New },
    { name: VisaStatusTypes.CollectingDocs, active: visa.status === VisaStatusTypes.CollectingDocs },
    { name: VisaStatusTypes.ReadyToSubmit, active: visa.status === VisaStatusTypes.ReadyToSubmit },
    { name: VisaStatusTypes.Submitted, active: visa.status === VisaStatusTypes.Submitted },
    { name: VisaStatusTypes.Approved, active: visa.status === VisaStatusTypes.Approved },
  ];

  const updateStatus = useUpdateVisaStatus();
  const handleStageChange = (stage: string) => {
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;

    const payload = { id: visa.id.toString(), status: pendingStage };
    updateStatus.mutate(payload, {
      onSuccess: () => {
        toast.success(toastMsg.updateSuccess(ENTITY.visa));
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message;

        toast.error(message || toastMsg.updateError(ENTITY.visa));
      },
    });
  };

  return (
    <div className="border rounded-lg">
      <div className="border-b px-6 py-3 flex justify-between">
        <p className="text-xl font-bold">Visa Stages</p>
      </div>

      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-base font-medium">Start</p>
          <p className="text-sm text-gray-500">{visa.startDate || '22/02/2025'}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Closing</p>
          <p className="text-sm text-gray-500">{visa.endDate || '-'}</p>
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
          title="Change Visa Stage"
          message={`Are you sure you want to change the visa stage to "${pendingStage}"?`}
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
