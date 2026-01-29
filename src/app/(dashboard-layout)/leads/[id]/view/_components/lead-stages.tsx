import StageItem from '@/components/organisms/stage-item';
import { cn } from '@/lib/utils';
import { useEditLead, useUpdateLeadStatus } from '@/mutations/leads/edit-lead';
import { useGetLeadById } from '@/query/get-leads';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';
import { Edit, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type LeadStagesProps = { lead: ILead };
export const LeadStages = ({ lead }: LeadStagesProps) => {
  const router = useRouter();
  const stages = [
    { name: LeadStatusTypes.New, active: lead.status === LeadStatusTypes.New },
    { name: LeadStatusTypes.Negotiation, active: lead.status === LeadStatusTypes.Negotiation },
    { name: LeadStatusTypes.Converted, active: lead.status === LeadStatusTypes.Converted },
    { name: LeadStatusTypes.NotInterested, active: lead.status === LeadStatusTypes.NotInterested },
    { name: LeadStatusTypes.FollowUp, active: lead.status === LeadStatusTypes.FollowUp },
  ];

  const updateLeadStatus = useUpdateLeadStatus();

  const handleStageChange = (stage: string) => {

    const payload = { id: lead.id.toString(), status: stage }
    updateLeadStatus.mutate(
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
