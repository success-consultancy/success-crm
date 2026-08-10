'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LeaveRecord } from '@/query/get-user-leaves';
import { useUpdateLeave, LeaveDecision } from '@/mutations/leave/update-leave';
import { formatLeaveDate, leaveTotalHours, stripHtml } from '../_lib/leave-helpers';

interface Props {
  leave: LeaveRecord | null;
  decision: LeaveDecision;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeaveDecisionDialog = ({ leave, decision, open, onOpenChange }: Props) => {
  const [managerNote, setManagerNote] = useState('');
  const updateLeave = useUpdateLeave();

  const isApproval = decision === 'approved';

  // Clear the draft note on close so the next request starts empty.
  const handleOpenChange = (next: boolean) => {
    if (!next) setManagerNote('');
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    if (!leave) return;
    try {
      await updateLeave.mutateAsync({ id: leave.id, status: decision, managerNote });
      handleOpenChange(false);
    } catch {
      // mutation surfaces the toast; keep the dialog open so the note isn't lost
    }
  };

  const requesterNote = stripHtml(leave?.note);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0" showCloseButton>
        <DialogHeader className="px-6 py-4 border-b border-neutral-border-light">
          <DialogTitle className="text-h4 font-bold text-neutral-black">
            {isApproval ? 'Approve leave request' : 'Reject leave request'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 py-5 max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
          {leave && (
            <div className="rounded-lg border border-neutral-border-light bg-[#F9FAFB] px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-b14-600 text-neutral-black">{leave.type}</span>
                <Badge className="bg-white-100 text-neutral-dark-grey border border-neutral-border-light font-medium">
                  {leaveTotalHours(leave)} hr total
                </Badge>
              </div>
              <div className="text-b14 text-neutral-dark-grey">
                {formatLeaveDate(leave.startDate)} — {formatLeaveDate(leave.endDate)} · {leave.hoursPerDay} hr/day
              </div>
              {requesterNote && <p className="text-b14 text-neutral-dark-grey">{requesterNote}</p>}
              {leave.attachmentURL && (
                <a
                  href={leave.attachmentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit rounded text-b14-600 text-primary-blue underline-offset-2 transition-colors duration-150 hover:text-blue-800 hover:underline active:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  View attachment
                </a>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="manager-note" className="text-b14-600 text-neutral-black">
                Manager&apos;s note
              </Label>
              <span className="text-b14 text-neutral-light-grey">(optional)</span>
            </div>
            <Textarea
              id="manager-note"
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
              placeholder={
                isApproval ? 'Anything the employee should know…' : 'Let the employee know why this was rejected…'
              }
              className="min-h-[88px] resize-y px-3 py-2 text-b16 text-neutral-black border-neutral-border placeholder:text-neutral-light-grey"
            />
          </div>

          <p className="text-b14 text-neutral-light-grey">
            The employee is emailed automatically once you {isApproval ? 'approve' : 'reject'} this request.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-border-light">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={updateLeave.isPending}
            className="h-10 px-4 text-b14-600 text-neutral-black border-neutral-border transition-all duration-150 active:bg-accent-100 motion-safe:active:scale-95"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={updateLeave.isPending}
            className={cn(
              'h-10 px-4 text-b14-600 text-white transition-all duration-150 motion-safe:active:scale-95',
              isApproval
                ? 'active:bg-primary/80'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/40',
            )}
          >
            {updateLeave.isPending ? 'Saving…' : isApproval ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDecisionDialog;
