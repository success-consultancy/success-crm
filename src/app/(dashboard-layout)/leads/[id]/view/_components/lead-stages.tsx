import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import StageItem from '@/components/organisms/stage-item';
import { useUpdateLeadStatus } from '@/mutations/leads/edit-lead';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';
import { Edit, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

type LeadStagesProps = { lead: ILead };
export const LeadStages = ({ lead }: LeadStagesProps) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const stages = [
    { name: LeadStatusTypes.New, active: lead.status === LeadStatusTypes.New },
    { name: LeadStatusTypes.Negotiation, active: lead.status === LeadStatusTypes.Negotiation },
    { name: LeadStatusTypes.Converted, active: lead.status === LeadStatusTypes.Converted },
    { name: LeadStatusTypes.NotInterested, active: lead.status === LeadStatusTypes.NotInterested },
  ];

  const updateLeadStatus = useUpdateLeadStatus();

  const handleStageChange = (stage: string) => {
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;
    updateLeadStatus.mutate(
      { id: lead.id.toString(), status: pendingStage },
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
    setPendingStage(null);
  };

  return (
    <div className="border rounded-lg shadow-sm ">

      <div className="border-b px-6 py-3 flex justify-between items-center">
        <p className="text-xl font-bold">Lead stages</p>

        <div className='flex gap-2'>
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/leads/${lead.id}/edit`);
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
          <p className="text-b14-600 text-neutral-black">Start</p>
          <p className="text-b14 text-neutral-dark-grey">22/02/2025</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-b14-600 text-neutral-black">Closing</p>
          <p className="text-b14 text-neutral-dark-grey">-</p>
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
        loading={updateLeadStatus.isPending}
      />
    </div>
  );
};
