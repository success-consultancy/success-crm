'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TableSkeleton from '@/components/organisms/table-skeleton';
import TableEmptyRow from '@/components/common/table-empty-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LeaveRecord } from '@/query/get-user-leaves';
import { useGetUsers } from '@/query/get-user';
import { LeaveDecision } from '@/mutations/leave/update-leave';
import { formatLeaveDate, LEAVE_STATUS_STYLES, sortLeavesByNewest, stripHtml } from '../_lib/leave-helpers';
import LeaveDecisionDialog from './leave-decision-dialog';

interface Props {
  leaves: LeaveRecord[];
  isLoading?: boolean;
  /** Show approve/reject actions on pending rows. Super admin only. */
  canApprove?: boolean;
}

const LeaveRequestsCard = ({ leaves, isLoading, canApprove = false }: Props) => {
  const [activeLeave, setActiveLeave] = useState<LeaveRecord | null>(null);
  const [decision, setDecision] = useState<LeaveDecision>('approved');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only approvers see the "Actioned by" column, so only they need the user list.
  const { data: users = [] } = useGetUsers(canApprove ? { includeInactive: true } : undefined);

  const rows = useMemo(() => sortLeavesByNewest(leaves), [leaves]);
  const pendingCount = useMemo(() => rows.filter((l) => l.status === 'pending').length, [rows]);

  const resolveName = (userId: number | null | undefined) => {
    if (!userId) return '-';
    const match = users.find((u) => u.id === userId);
    return match ? `${match.firstName ?? ''} ${match.lastName ?? ''}`.trim() || '-' : '-';
  };

  const openDecision = (leave: LeaveRecord, next: LeaveDecision) => {
    setActiveLeave(leave);
    setDecision(next);
    setDialogOpen(true);
  };

  const colSpan = canApprove ? 9 : 7;

  return (
    <div className="rounded-xl border border-neutral-border-light bg-white-100 px-4">
      <div className="flex items-center gap-2 py-4 border-b border-neutral-border-light">
        <h4 className="text-b16-600 text-neutral-black">Leave requests</h4>
        {pendingCount > 0 && (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-medium border-0">
            {pendingCount} pending
          </Badge>
        )}
      </div>

      <div className="py-4">
        <div className="rounded-xl border border-neutral-border-light overflow-hidden">
          <div className="overflow-auto custom-scrollbar max-h-[420px]">
            <Table>
              <TableHeader className="bg-[#F9FAFB] sticky top-0 z-10">
                <TableRow className="border-b border-neutral-border-light hover:bg-[#F9FAFB]">
                  <Th>Type</Th>
                  <Th>Dates</Th>
                  <Th>Hrs/day</Th>
                  <Th>Requested</Th>
                  <Th>Status</Th>
                  <Th>Reason</Th>
                  <Th>Manager&apos;s note</Th>
                  {canApprove && <Th>Actioned by</Th>}
                  {canApprove && <Th>Action</Th>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableSkeleton columns={colSpan} rows={5} />}
                {!isLoading && rows.length === 0 && (
                  <TableEmptyRow
                    colSpan={colSpan}
                    size="sm"
                    title="No leave requests yet"
                    description="Leave requests will appear here once submitted."
                  />
                )}
                {!isLoading &&
                  rows.map((leave) => (
                    <TableRow
                      key={leave.id}
                      className="border-b border-neutral-border-light last:border-0 transition-colors duration-150 hover:bg-accent-50"
                    >
                      <Td>{leave.type}</Td>
                      <Td>
                        {formatLeaveDate(leave.startDate)} — {formatLeaveDate(leave.endDate)}
                      </Td>
                      <Td>{leave.hoursPerDay}</Td>
                      <Td>{leave.createdAt ? format(new Date(leave.createdAt), 'd MMM yyyy') : '-'}</Td>
                      <Td>
                        <Badge
                          className={cn(
                            'font-medium border-0 capitalize',
                            LEAVE_STATUS_STYLES[leave.status] ?? 'bg-gray-100 text-gray-700 hover:bg-gray-100',
                          )}
                        >
                          {leave.status}
                        </Badge>
                      </Td>
                      <NoteCell value={leave.note} attachmentURL={leave.attachmentURL} />
                      <NoteCell value={leave.managerNote} />
                      {canApprove && <Td>{resolveName(leave.updatedBy)}</Td>}
                      {canApprove && (
                        <TableCell className="px-3 py-3 whitespace-nowrap">
                          {leave.status === 'pending' ? (
                            <div className="flex items-center gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Approve leave request"
                                    onClick={() => openDecision(leave, 'approved')}
                                    className="h-8 w-8 p-0 border-neutral-border text-green-700 transition-all duration-150 hover:bg-green-50 hover:border-green-600 hover:text-green-800 active:bg-green-100 motion-safe:active:scale-95 focus-visible:ring-2 focus-visible:ring-green-600/40"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Approve</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Reject leave request"
                                    onClick={() => openDecision(leave, 'rejected')}
                                    className="h-8 w-8 p-0 border-neutral-border text-red-600 transition-all duration-150 hover:bg-red-50 hover:border-red-500 hover:text-red-700 active:bg-red-100 motion-safe:active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500/40"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reject</TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <span className="text-b14 text-neutral-light-grey">-</span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <LeaveDecisionDialog leave={activeLeave} decision={decision} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

/** Notes come back as legacy TinyMCE HTML — rendered as plain text, truncated. */
const NoteCell = ({ value, attachmentURL }: { value?: string | null; attachmentURL?: string | null }) => {
  const text = stripHtml(value);
  return (
    <TableCell className="text-b14 text-neutral-dark-grey px-3 py-3 max-w-[220px]">
      <div className="flex flex-col gap-1">
        {text ? (
          <span className="line-clamp-2" title={text}>
            {text}
          </span>
        ) : (
          <span className="text-neutral-light-grey">-</span>
        )}
        {attachmentURL && (
          <a
            href={attachmentURL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded text-b14-600 text-primary-blue underline-offset-2 transition-colors duration-150 hover:text-blue-800 hover:underline active:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Attachment
          </a>
        )}
      </div>
    </TableCell>
  );
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <TableHead className="text-b14-600 text-neutral-dark-grey px-3 py-3">{children}</TableHead>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <TableCell className="text-b14 text-neutral-dark-grey px-3 py-3">{children}</TableCell>
);

export default LeaveRequestsCard;
