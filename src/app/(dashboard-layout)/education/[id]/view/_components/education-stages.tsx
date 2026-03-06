import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Edit, Eye, MessageCircle } from 'lucide-react';
import StageItem from '@/components/organisms/stage-item';
import { useUpdateEducationStatus } from '@/mutations/education/add-education';
import { EducationStatusTypes, IEducation } from '@/types/response-types/education-response';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { useState } from 'react';

type EducationStagesProps = { education: IEducation };
export const EducationStages = ({ education }: EducationStagesProps) => {
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const stages = [
    { name: EducationStatusTypes.New, active: education.status === EducationStatusTypes.New },
    { name: EducationStatusTypes.ChecklistSent, active: education.status === EducationStatusTypes.ChecklistSent },
    { name: EducationStatusTypes.ApplicationReady, active: education.status === EducationStatusTypes.ApplicationReady },
    { name: EducationStatusTypes.ApplicationSubmitted, active: education.status === EducationStatusTypes.ApplicationSubmitted },
    { name: EducationStatusTypes.OfferReceived, active: education.status === EducationStatusTypes.OfferReceived },
  ];

  const updateStatus = useUpdateEducationStatus();

  const handleStageChange = (stage: string) => {
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;

    const payload = { id: education.id.toString(), status: pendingStage }
    updateStatus.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success('Education updated successfully');
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;

          toast.error(message || 'Failed to update education');
        },
      },
    );
  }


  return (
    <div className="border rounded-lg shadow-sm ">
      <div className="border-b px-6 py-3 flex justify-between items-center">
        <p className="text-xl font-bold">Education stages</p>

        <div className='flex gap-2'>
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/education/${education.id}/edit`);
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
          <p className="text-sm text-gray-500">22/02/2025</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Closing</p>
          <p className="text-sm text-gray-500">-</p>
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

        <div className="flex gap-2 ml-4">
          <button className="px-4 py-2 rounded-md bg-green-100 text-green-700 font-medium">Won</button>
          <button className="px-4 py-2 rounded-md bg-red-100 text-red-700 font-medium">Lost</button>
        </div>
      </div>
    </div>
  );
};
