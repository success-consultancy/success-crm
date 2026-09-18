import { Skeleton } from '@/components/ui/skeleton';

interface InfoSection {
  /** Tailwind width class for the section title placeholder. */
  titleWidth?: string;
  /** Number of label/value field placeholders in the grid. */
  fields: number;
}

interface ViewPageSkeletonProps {
  /** Number of tab labels in the sticky tab bar (Overview/History/Follow-up, etc). */
  tabs?: number;
  /** Number of segments in the stages strip. Omit to skip the stages card entirely. */
  stageCount?: number;
  /** One card per entry — mirrors sections like Personal details, Visa information, Course info. */
  infoSections?: InfoSection[];
  /** Education-only course fee table. */
  showFeeTable?: boolean;
  /** Trailing table-style card — Accounts, Documents, etc (title placeholder only). */
  showTable?: boolean;
  /** Misc section (source/assignee + note). */
  showMisc?: boolean;
  /** Number of note-style cards (Visa note, Notes, etc). */
  noteCount?: number;
}

const InfoCard = ({ titleWidth = 'w-32', fields }: InfoSection) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className={`h-6 ${titleWidth}`} />
      <Skeleton className="h-4 w-10" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  </div>
);

const ViewPageSkeleton = ({
  tabs = 3,
  stageCount = 8,
  infoSections = [{ fields: 9 }, { fields: 6 }],
  showFeeTable = false,
  showTable = false,
  showMisc = false,
  noteCount = 1,
}: ViewPageSkeletonProps) => {
  return (
    <div className="flex flex-col py-10 gap-8 !p-6">
      <div className="bg-white rounded-lg p-4">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 rounded-t-lg bg-white px-4 pt-4 flex items-center border-b">
          <div className="flex gap-6 py-2">
            {Array.from({ length: tabs }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-16" />
            ))}
          </div>
          <div className="ml-auto pb-1 flex gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {stageCount > 0 && (
            <div className="border rounded-lg">
              <div className="border-b px-6 py-3">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="px-6 py-3 flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-1">
                {Array.from({ length: stageCount }).map((_, i) => (
                  <Skeleton key={i} className="h-10 flex-1" />
                ))}
              </div>
            </div>
          )}

          {infoSections.map((section, i) => (
            <InfoCard key={i} {...section} />
          ))}

          {showFeeTable && (
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="rounded-md border">
                <div className="flex border-b px-3 py-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                  ))}
                </div>
                {Array.from({ length: 2 }).map((_, row) => (
                  <div key={row} className="flex px-3 py-3 gap-4 border-b last:border-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {showTable && (
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-28" />
            </div>
          )}

          {showMisc && (
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          )}

          {Array.from({ length: noteCount }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-20 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPageSkeleton;
