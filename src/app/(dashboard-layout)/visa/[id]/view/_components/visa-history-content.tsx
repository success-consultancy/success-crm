import CardContainer from '@/components/atoms/card-container';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useGetLeadLog } from '@/query/get-leads'; // temporarily using lead API
import { useState } from 'react';
import Button from '@/components/atoms/button';
import Loading from '@/components/organisms/loading';
import { useGetVisaLog } from '@/query/get-visa';

// Temporary Visa History Type (matches your structure)
type VisaHistoryItem = {
  versionId: string;
  versionType: number;
  versionTypeName: string;
  timestamp: string;
  formattedDate: string;
  formattedTime: string;
  updatedBy: string;
  changes: Array<{
    field: string;
    fieldDisplayName: string;
    oldValue: string;
    newValue: string;
    description: string;
  }>;
  changeCount: number;
  isInitialVersion: boolean;
  summaryDescriptions: string[];
};

const ExpandableDescriptions = ({ descriptions }: { descriptions: string[] }) => {
  const [showAll, setShowAll] = useState(false);

  if (descriptions.length === 0) return null;

  const shouldShowMoreButton = descriptions.length > 3;
  const displayedDescriptions = showAll ? descriptions : descriptions.slice(0, 3);

  return (
    <div className="mt-2 space-y-1">
      {displayedDescriptions.map((description, idx) => (
        <p key={idx} className="text-sm text-gray-600">
          {description}
        </p>
      ))}

      {shouldShowMoreButton && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)} className="text-xs h-7 px-2">
            {showAll ? 'Show Less' : `Show More (${descriptions.length - 3} more)`}
          </Button>
        </div>
      )}
    </div>
  );
};

const VisaHistoryContent = ({ visaId }: { visaId: string }) => {
  // ✔️ Using lead log API for now
  const { data, isLoading } = useGetVisaLog(visaId);

  const VERSION_TYPES = {
    1: 'Created',
    2: 'Updated',
    3: 'Deleted',
  };

  const logs: VisaHistoryItem[] = (data as unknown as VisaHistoryItem[]) || [];

  return (
    <CardContainer className="w-full">
      <h2 className="text-lg font-semibold mb-4">Visa history</h2>
      <div className="space-y-6">
        <Loading isLoading={isLoading}>
          {logs?.map((log, i) => (
            <div key={log.versionId} className="relative pl-6">
              {/* timeline dot */}
              <span
                className={cn(
                  'absolute left-0 top-2 h-3 w-3 rounded-full',
                  'bg-green-500', // Different color from lead history
                )}
              />
              <div>
                <p className="text-b1-b">Visa {log.versionTypeName}</p>
                <p className="text-b1 text-neutral-light-grey mt-1">
                  by {log.updatedBy}, {log.formattedDate}, {log.formattedTime}
                </p>

                {/* Summary */}
                {log.versionType === 2 && log.summaryDescriptions.length > 0 && (
                  <ExpandableDescriptions descriptions={log.summaryDescriptions} />
                )}
              </div>

              {i < logs.length - 1 && <Separator className="absolute left-[5px] top-6 h-full w-[1px] bg-gray-300" />}
            </div>
          ))}
        </Loading>
      </div>
    </CardContainer>
  );
};

export default VisaHistoryContent;
