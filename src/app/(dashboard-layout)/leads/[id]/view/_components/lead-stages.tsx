import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import StageItem from '@/components/organisms/stage-item';
import { useUpdateLeadStatus } from '@/mutations/leads/edit-lead';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';
import { Edit, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

type LeadStagesProps = {
  lead: ILead;
  onFollowUpClick?: () => void;
};

function getDaysForStage(lead: ILead, stageName: string): number | null {
  const history = lead.leadStageHistory;
  if (!history || history.length === 0) return null;
  const entry = history.find((h) => h.stage === stageName);
  return entry?.days ?? null;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '-';
  }
}

function getClosingDate(lead: ILead): string {
  const history = lead.leadStageHistory;
  if (!history) return '-';
  const closedEntry = history.find((h) => (h.stage === 'Converted' || h.stage === 'Not Interested') && h.startDate);
  return closedEntry ? formatDate(closedEntry.startDate) : '-';
}

export const LeadStages = ({ lead, onFollowUpClick }: LeadStagesProps) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  const mainStages = [
    LeadStatusTypes.New,
    LeadStatusTypes.Negotiation,
    LeadStatusTypes.Converted,
    LeadStatusTypes.NotInterested,
  ];

  const currentStage = lead.leadStage || lead.status || LeadStatusTypes.New;
  const activeIndex = mainStages.findIndex((s) => s === currentStage);

  // Check if lead has follow-up
  const hasFollowUp = !!lead.followUpDate;

  const updateLeadStatus = useUpdateLeadStatus();

  const handleStageChange = (stage: string) => {
    if (stage === 'Follow-up') {
      onFollowUpClick?.();
      return;
    }
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const handleWonLost = (type: 'won' | 'lost') => {
    const stage = type === 'won' ? LeadStatusTypes.Converted : LeadStatusTypes.NotInterested;
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

  console.log(currentStage);

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="border-b px-6 py-3 flex justify-between items-center">
        <p className="text-xl font-bold">Lead stages</p>

        <div className="flex gap-2">
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
          <p className="text-b14 text-neutral-dark-grey">{formatDate(lead.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-b14-600 text-neutral-black">Closing</p>
          <p className="text-b14 text-neutral-dark-grey">{getClosingDate(lead)}</p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-4 items-end">
        <div className="flex w-full items-end">
          {mainStages.map((stage, index) => (
            <StageItem
              key={stage}
              name={stage}
              active={stage === currentStage}
              completed={activeIndex !== -1 && index < activeIndex}
              isFirst={index === 0}
              days={getDaysForStage(lead, stage)}
              handleStageChange={handleStageChange}
            />
          ))}

          {/* Follow-up stage indicator */}
          <div className="relative flex flex-col items-center w-full">
            {getDaysForStage(lead, 'Follow-up') != null && (getDaysForStage(lead, 'Follow-up') ?? 0) > 0 && (
              <div className="mb-1">
                <span className="inline-block bg-gray-700 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {getDaysForStage(lead, 'Follow-up')} days
                </span>
              </div>
            )}
            <div
              className={`relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium whitespace-nowrap w-full cursor-pointer ${
                hasFollowUp ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 15px 50%)`,
              }}
              onClick={() => handleStageChange('Follow-up')}
            >
              Follow-up
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4 shrink-0">
          <button
            onClick={() => handleWonLost('won')}
            className={`px-4 py-2 rounded-md font-medium ${
              currentStage === LeadStatusTypes.Converted ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
            }`}
          >
            Won
          </button>
          <button
            onClick={() => handleWonLost('lost')}
            className={`px-4 py-2 rounded-md font-medium ${
              currentStage === LeadStatusTypes.NotInterested ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
            }`}
          >
            Lost
          </button>
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
