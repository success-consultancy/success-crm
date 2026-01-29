import { cn } from '@/lib/utils';
import { IVisa, IVisaDetail, VisaStatusTypes } from '@/types/response-types/visa-response';
import { useRouter } from 'next/navigation';
import { Edit, MessageCircle } from 'lucide-react';
import StageItem from '@/components/organisms/stage-item';
import { toast } from 'sonner';
import { useUpdateVisaStatus } from '@/mutations/visa/add-visa';


type VisaStagesProps = { visa: IVisaDetail };

export const VisaStages = ({ visa }: VisaStagesProps) => {
  const router = useRouter();
  const stages = [
    { name: VisaStatusTypes.NewApplicant, active: visa.status === VisaStatusTypes.NewApplicant },
    { name: VisaStatusTypes.CollectingDocs, active: visa.status === VisaStatusTypes.CollectingDocs },
    { name: VisaStatusTypes.ReadyToSubmit, active: visa.status === VisaStatusTypes.ReadyToSubmit },
    { name: VisaStatusTypes.Submitted, active: visa.status === VisaStatusTypes.Submitted },
    { name: VisaStatusTypes.Approved, active: visa.status === VisaStatusTypes.Approved },
  ];

  const updateStatus = useUpdateVisaStatus();

  const handleStageChange = (stage: string) => {

    const payload = { id: visa.id.toString(), status: stage }
    updateStatus.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success('Visa updated successfully');
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;

          toast.error(message || 'Failed to update visa');
        },
      },
    );
  }


  return (
    <div className="border rounded-lg">
      <div className="border-b px-6 py-3 flex justify-between">
        <p className="text-xl font-bold">Visa Stages</p>


        <div className='flex gap-2'>
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/visa/${visa.id}/edit`);
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
          <p className="text-sm text-gray-500">{visa.startDate || '22/02/2025'}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Closing</p>
          <p className="text-sm text-gray-500">{visa.endDate || '-'}</p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-10">
        <div className="flex w-full">
          {stages.map((stage, index) => (
            <StageItem key={stage.name} name={stage.name} active={stage.active} isFirst={index === 0} handleStageChange={handleStageChange} />
          ))}
        </div>

        <div className="flex gap-2 ml-4">
          <button className="px-4 py-2 rounded-md bg-green-100 text-green-700 font-medium">Won</button>
          <button className="px-4 py-2 rounded-md bg-red-100 text-red-700 font-medium">Lost</button>
        </div>
      </div>
    </div>
  );
};
