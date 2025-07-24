import { cn } from '@/lib/cn';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';

interface StageProps {
  name: string;
  active?: boolean;
  isFirst?: boolean;
}

type Props = {
  lead: ILead;
};

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

export const LeadStages = ({ lead }: Props) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const stages = [
    { name: 'New', active: lead.status === LeadStatusTypes.New },
    { name: 'Follow Up', active: lead.status === LeadStatusTypes.FollowUp },
    { name: 'Converted', active: lead.status === LeadStatusTypes.Converted },
    { name: 'Not Converted', active: lead.status === LeadStatusTypes.NotConverted },
  ];

  return (
    <div className="border rounded-lg shadow-sm ">
      <div className="border-b px-6 py-3">
        <p className="text-xl font-bold">Lead stages</p>
      </div>

      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-base font-medium">Start</p>
          <p className="text-sm text-gray-500">{formatDate(lead.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-base font-medium">Follow Up</p>
          <p className="text-sm text-gray-500">{formatDate(lead.followUpDate)}</p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-10">
        <div className="flex w-full">
          {stages.map((stage, index) => (
            <StageItem key={stage.name} name={stage.name} active={stage.active} isFirst={index === 0} />
          ))}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            className={cn(
              'px-4 py-2 rounded-md font-medium',
              lead.status === LeadStatusTypes.Converted ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700',
            )}
          >
            Won
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-md font-medium',
              lead.status === LeadStatusTypes.NotConverted ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700',
            )}
          >
            Lost
          </button>
        </div>
      </div>
    </div>
  );
};
