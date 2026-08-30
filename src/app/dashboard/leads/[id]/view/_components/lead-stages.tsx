import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import StageItem from '@/components/organisms/stage-item';
import { useReopenLead, useUpdateLeadStatus } from '@/mutations/leads/edit-lead';
import { useGetFollowUp } from '@/query/get-leads';
import { ILead, LeadStatusTypes } from '@/types/response-types/leads-response';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ENTITY, toastMsg } from '@/constants/messages';

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
  // Reopening a lead appends further stages after a closed one, so a lead can
  // hold several terminal entries — the latest is the one that counts.
  const closedEntry = [...history]
    .reverse()
    .find(
      (h) =>
        (h.stage === LeadStatusTypes.Converted ||
          h.stage === LeadStatusTypes.NotConverted ||
          h.stage === LeadStatusTypes.NotInterested) &&
        h.startDate,
    );
  return closedEntry ? formatDate(closedEntry.startDate) : '-';
}

// A lead can only be reopened once it has closed — converted or disqualified.
const CLOSED_STAGES: string[] = [
  LeadStatusTypes.Converted,
  LeadStatusTypes.NotConverted,
  LeadStatusTypes.NotInterested,
];

export const LeadStages = ({ lead, onFollowUpClick }: LeadStagesProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);
  const [reopenOpen, setReopenOpen] = useState(false);

  const mainStages = [
    LeadStatusTypes.New,
    LeadStatusTypes.Negotiation,
    LeadStatusTypes.Converted,
    LeadStatusTypes.NotConverted,
  ];

  const currentStage = lead.leadStage || lead.status || LeadStatusTypes.New;
  const activeIndex = mainStages.findIndex((s) => s === currentStage);

  const wonEnabled = currentStage === LeadStatusTypes.Converted;
  const lostEnabled = currentStage === LeadStatusTypes.NotConverted || currentStage === LeadStatusTypes.NotInterested;

  const { data: followUps } = useGetFollowUp(lead.id.toString(), 'lead');
  const hasFollowUp = Array.isArray(followUps) && followUps.length > 0;

  const updateLeadStatus = useUpdateLeadStatus();
  const reopenLead = useReopenLead();

  const canReopen = CLOSED_STAGES.includes(currentStage);

  const handleStageChange = (stage: string) => {
    if (stage === LeadStatusTypes.FollowUp) {
      onFollowUpClick?.();
      return;
    }
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const handleWonLost = (type: 'won' | 'lost') => {
    const stage = type === 'won' ? LeadStatusTypes.Converted : LeadStatusTypes.NotConverted;
    setPendingStage(stage);
    setConfirmOpen(true);
  };

  const confirmStageChange = () => {
    if (!pendingStage) return;

    updateLeadStatus.mutate(
      { id: lead.id.toString(), status: pendingStage },
      {
        onSuccess: () => {
          toast.success(toastMsg.updateSuccess(ENTITY.lead));
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message;
          toast.error(message || toastMsg.updateError(ENTITY.lead));
        },
      },
    );
    setPendingStage(null);
  };

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="border-b px-6 py-3 flex justify-between items-center">
        <p className="text-xl font-bold">Lead stages</p>
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
        <div className="hide-scrollbar flex min-w-0 flex-1 items-end overflow-x-auto">
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
          <div className="group relative flex flex-col items-center w-full">
            {getDaysForStage(lead, LeadStatusTypes.FollowUp) != null &&
              (getDaysForStage(lead, LeadStatusTypes.FollowUp) ?? 0) > 0 && (
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <span className="inline-block whitespace-nowrap rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-white">
                    {getDaysForStage(lead, LeadStatusTypes.FollowUp)} days
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
              onClick={() => handleStageChange(LeadStatusTypes.FollowUp)}
            >
              Follow-up
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4 shrink-0">
          <button
            onClick={() => handleWonLost('won')}
            disabled={!wonEnabled}
            className={`px-4 py-2 rounded-md font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
              currentStage === LeadStatusTypes.Converted ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
            }`}
          >
            Won
          </button>
          <button
            onClick={() => handleWonLost('lost')}
            disabled={!lostEnabled}
            className={`px-4 py-2 rounded-md font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
              currentStage === LeadStatusTypes.NotConverted || currentStage === LeadStatusTypes.NotInterested
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-700'
            }`}
          >
            Lost
          </button>

          {canReopen && (
            <button
              onClick={() => setReopenOpen(true)}
              disabled={reopenLead.isPending}
              className="px-4 py-2 rounded-md font-medium border border-neutral-border-light bg-white text-neutral-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reopen lead
            </button>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={reopenOpen}
        setIsOpen={setReopenOpen}
        title="Reopen this lead"
        message={`This lead will move from "${currentStage}" back to the "${LeadStatusTypes.New}" stage so it can be worked again. Its stage history is kept.`}
        confirmText="Yes, reopen"
        cancelText="Cancel"
        onConfirm={() => reopenLead.mutate(lead.id.toString())}
        loading={reopenLead.isPending}
      />

      {/* <ConfirmationDialog
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        title="Change Lead Stage"
        message={`Are you sure you want to change the lead stage to "${pendingStage}"?`}
        confirmText="Yes, change it"
        cancelText="Cancel"
        onConfirm={confirmStageChange}
        onCancel={() => setPendingStage(null)}
        loading={updateLeadStatus.isPending}
      /> */}
    </div>
  );
};
