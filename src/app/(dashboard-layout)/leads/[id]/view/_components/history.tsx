import CardContainer from '@/components/atoms/card-container';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useGetLeadLog } from '@/query/get-leads';
import { ILead } from '@/types/response-types/leads-response';

export const History = ({ lead }: { lead: ILead }) => {
  const { data } = useGetLeadLog(lead.id.toString());
  const VERSION_TYPES = {
    1: 'Created',
    2: 'Updated',
    3: 'Deleted',
  };

  const logs = data?.map((lead: ILead) => {
    const type = lead.version_type ? VERSION_TYPES[lead.version_type as keyof typeof VERSION_TYPES] : 'Unknown';
    const changes = null;

    if (lead.version_type === 2) {
      //   changes = getChangedFields(lead.dataValues, lead._previousDataValues);
    }

    return {
      type,
      timestamp: lead.updatedAt,
      updatedBy: lead.updatedBy,
      updatedByUser: lead.UpdatedByUser,
      changes,
    };
  });

  return (
    <CardContainer className="w-full">
      <h2 className="text-lg font-semibold mb-4">Lead history</h2>
      <div className="space-y-6">
        {logs?.map((log, i) => (
          <div key={log.timestamp} className="relative pl-6">
            {/* Timeline dot */}
            <span className={cn('absolute left-0 top-2 h-3 w-3 rounded-full', 'bg-sky-500')} />
            <div>
              <p className="text-b1-b">Lead {log.type}</p>
              <p className="text-b1 text-neutral-light-grey mt-1">
                by {log.updatedByUser?.firstName} {log.updatedByUser?.lastName},{' '}
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>

            {i < logs.length - 1 && <Separator className="absolute left-[5px] top-6 h-full w-[1px] bg-gray-300" />}
          </div>
        ))}
      </div>
    </CardContainer>
  );
};
