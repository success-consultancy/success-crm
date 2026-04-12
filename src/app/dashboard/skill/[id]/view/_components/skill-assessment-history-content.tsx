import CardContainer from '@/components/atoms/card-container';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Button from '@/components/atoms/button';
import Loading from '@/components/organisms/loading';
import { useGetSkillAssessmentLog } from '@/query/get-skill-assessments';
import { DateRangePicker } from '@/components/molecules/date-range.picker';
import useSearchParams from '@/hooks/use-search-params';

type SkillAssessmentHistoryItem = {
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

const SkillAssessmentHistoryContent = ({ skillAssessmentId }: { skillAssessmentId: string }) => {
  const { setParams, searchParams } = useSearchParams();
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const logParams = {
    from: fromParam || undefined,
    to: toParam || undefined,
  };

  const { data, isLoading } = useGetSkillAssessmentLog(skillAssessmentId, logParams);

  const logs: SkillAssessmentHistoryItem[] = (data as unknown as SkillAssessmentHistoryItem[]) || [];

  const handleDateRangeApply = (range: { from: Date | undefined; to: Date | undefined }) => {
    setParams([
      { name: 'from', value: range.from?.toISOString() || null },
      { name: 'to', value: range.to?.toISOString() || null },
    ]);
  };

  const getDisplayText = (log: SkillAssessmentHistoryItem) => {
    // For updates, use the first summary description if available
    if (log.versionType === 2 && log.summaryDescriptions && log.summaryDescriptions.length > 0) {
      return log.summaryDescriptions[0];
    }
    // For created, use "Skill Assessment Created"
    if (log.versionType === 1) {
      return 'Skill Assessment Created';
    }
    // For deleted, use "Skill Assessment Deleted"
    if (log.versionType === 3) {
      return 'Skill Assessment Deleted';
    }
    // Fallback - use versionTypeName if available, otherwise default text
    if (log.versionTypeName) {
      return `Skill Assessment ${log.versionTypeName}`;
    }
    return 'Skill Assessment Updated';
  };

  const formatUpdatedBy = (updatedBy: string | number | undefined) => {
    if (!updatedBy) return 'Unknown';
    if (typeof updatedBy === 'number') return updatedBy.toString();
    return updatedBy;
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return date;
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return '';
    return time;
  };

  if (!isLoading && (!logs || logs.length === 0)) {
    return (
      <CardContainer className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Applicant history</h2>
          <DateRangePicker onApply={handleDateRangeApply} />
        </div>
        <div className="text-center py-8 text-gray-500">No history available</div>
      </CardContainer>
    );
  }

  return (
    <CardContainer className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Applicant history</h2>
        <DateRangePicker onApply={handleDateRangeApply} />
      </div>
      <div className="space-y-6">
        <Loading isLoading={isLoading}>
          <>
            {logs && logs.length > 0 ? (
              logs.map((log, i) => {
                const key = log.versionId || `log-${i}`;
                const updatedBy = formatUpdatedBy(log.updatedBy);
                const formattedDate = formatDate(log.formattedDate);
                const formattedTime = formatTime(log.formattedTime);
                const dateTimeStr = [formattedDate, formattedTime].filter(Boolean).join(', ');

                return (
                  <div key={key} className="relative pl-6">
                    <span className={cn('absolute left-0 top-2 h-3 w-3 rounded-full', 'bg-blue-500')} />
                    <div>
                      <p className="text-b1-b">{getDisplayText(log)}</p>
                      {dateTimeStr && (
                        <p className="text-b1 text-neutral-light-grey mt-1">
                          by {updatedBy}{dateTimeStr ? `, ${dateTimeStr}` : ''}
                        </p>
                      )}

                      {/* Show additional descriptions if there are more than one */}
                      {log.versionType === 2 &&
                        log.summaryDescriptions &&
                        log.summaryDescriptions.length > 1 && (
                          <ExpandableDescriptions descriptions={log.summaryDescriptions.slice(1)} />
                        )}
                    </div>

                    {i < logs.length - 1 && (
                      <Separator className="absolute left-[5px] top-6 h-full w-[1px] bg-gray-300" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">No history available</div>
            )}
          </>
        </Loading>
      </div>
    </CardContainer>
  );
};

export default SkillAssessmentHistoryContent;
