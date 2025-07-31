import { cn } from '@/lib/utils';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';

interface StageProps {
  name: string;
  active?: boolean;
  isFirst?: boolean;
}

const StageItem = ({ name, active, isFirst }: StageProps) => {
  const baseClasses =
    'relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium whitespace-nowrap w-full';
  const inactiveClasses = 'bg-gray-100 text-gray-800';
  const activeClasses = 'bg-primary-blue text-white';
  const pointSize = 15;

  const clipPathValue = isFirst
    ? `polygon(0 0, calc(100% - ${pointSize}px) 0, 100% 50%, calc(100% - ${pointSize}px) 100%, 0 100%)`
    : `polygon(0 0, calc(100% - ${pointSize}px) 0, 100% 50%, calc(100% - ${pointSize}px) 100%, 0 100%, ${pointSize}px 50%)`;

  return (
    <div
      className={cn(baseClasses, active ? activeClasses : inactiveClasses, !isFirst && `-ml-[${pointSize}px]`)}
      style={{ clipPath: clipPathValue }}
    >
      {name}
    </div>
  );
};

type LeadStagesProps = { lead: ILead };
export const LeadStages = ({ lead }: LeadStagesProps) => {
  const stages = [
    { name: 'New', active: lead.status === LeadStatusTypes.New },
    { name: 'Negotiation', active: lead.status === LeadStatusTypes.Negotiation },
    { name: 'Converted', active: lead.status === LeadStatusTypes.Converted },
    { name: 'Not Interested', active: lead.status === LeadStatusTypes.NotInterested },
    { name: 'Follow Up', active: lead.status === LeadStatusTypes.FollowUp },
  ];

  return (
    <div className="border rounded-lg shadow-sm ">
      <div className="border-b px-6 py-3">
        <p className="text-xl font-bold">Lead stages</p>
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
            <StageItem key={stage.name} name={stage.name} active={stage.active} isFirst={index === 0} />
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
