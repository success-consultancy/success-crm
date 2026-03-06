import { cn } from '@/lib/utils';
import { IVisa, IVisaDetail, VisaStatusTypes } from '@/types/response-types/visa-response';
import { useRouter } from 'next/navigation';
import { Edit, MessageCircle } from 'lucide-react';
import { ITribunalReview, TribunalStatusTypes } from '@/types/response-types/tribunal-review-response';
import { format } from 'date-fns';
import { toast } from 'sonner';
import StageItem from '@/components/organisms/stage-item';
import { useUpdateTribunalStatus } from '@/mutations/tribunal-review/add-tribunal-review';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { useState } from 'react';

type VisaStagesProps = { visa: ITribunalReview };

export const VisaStages = ({ visa }: VisaStagesProps) => {
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const stages = [
    { name: TribunalStatusTypes.NewTribunal, active: visa.status === TribunalStatusTypes.NewTribunal },
    { name: TribunalStatusTypes.CollectingDocs, active: visa.status === TribunalStatusTypes.CollectingDocs },
    { name: TribunalStatusTypes.ReadyToSubmit, active: visa.status === TribunalStatusTypes.ReadyToSubmit },
    { name: TribunalStatusTypes.Submitted, active: visa.status === TribunalStatusTypes.Submitted },
    { name: TribunalStatusTypes.InfoRequested, active: visa.status === TribunalStatusTypes.InfoRequested },
    { name: TribunalStatusTypes.Remitted, active: visa.status === TribunalStatusTypes.Remitted },
    { name: TribunalStatusTypes.Withdrawn, active: visa.status === TribunalStatusTypes.Withdrawn },
    { name: TribunalStatusTypes.Refused, active: visa.status === TribunalStatusTypes.Refused },
    { name: TribunalStatusTypes.Discontinued, active: visa.status === TribunalStatusTypes.Discontinued },
    { name: TribunalStatusTypes.MinisterialApproved, active: visa.status === TribunalStatusTypes.MinisterialApproved },
    { name: TribunalStatusTypes.MinisterialIntervention, active: visa.status === TribunalStatusTypes.MinisterialIntervention },
    { name: TribunalStatusTypes.MinisterialRefused, active: visa.status === TribunalStatusTypes.MinisterialRefused },
    { name: TribunalStatusTypes.Other, active: visa.status === TribunalStatusTypes.Other },
    { name: TribunalStatusTypes.FollowUp, active: visa.status === TribunalStatusTypes.FollowUp },
  ];

  const updateStatus = useUpdateTribunalStatus();

  const handleStageChange = (stage: string) => {
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;

    const payload = { id: visa.id.toString(), status: pendingStage }
    updateStatus.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success('Lead updated successfully');
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;

          toast.error(message || 'Failed to update lead');
        },
      },
    );
  }


  return (
    <div className="border rounded-lg">
      <div className="border-b px-6 py-3 flex justify-between">
        <p className="text-xl font-bold">Tribunal Stages</p>


        <div className='flex gap-2'>
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tribunal-review/${visa.id}/edit`);
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
          <p className="text-sm text-gray-500">{format(visa.createdAt, 'dd/MM/yyyy') || '22/02/2025'}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Closing</p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-10">
        <div className="flex w-full overflow-x-auto">
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
          title="Change Tribunal Stage"
          message={`Are you sure you want to change the tribunal stage to "${pendingStage}"?`}
          confirmText="Yes, change it"
          cancelText="Cancel"
          onConfirm={confirmStageChange}
          onCancel={() => setPendingStage(null)}
          loading={updateStatus.isPending}
        />

        <div className="flex gap-2 ml-4">
          <button className="px-4 py-2 rounded-md bg-green-100 text-green-700 font-medium">Won</button>
          <button className="px-4 py-2 rounded-md bg-red-100 text-red-700 font-medium">Lost</button>
        </div>
      </div>
    </div>
  );
};
