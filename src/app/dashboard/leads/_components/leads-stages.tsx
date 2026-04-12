import Button from '@/components/atoms/button';
import SectionWrapper from '@/components/templates/section-wrapper';
import Stage from '@/components/templates/stage';

const LeadStages = () => {
  const leadsStages = ['New lead', 'Negotiation', 'Converted', 'Not converted', 'Follow up'];
  return (
    <SectionWrapper title="Lead Stages">
      <div className="space-y-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-b1-b">Start</span>
            <span className="text-sm text-neutral-lightGrey">22/02/2025</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-b1-b">Closing</span>
            <span className="text-sm text-neutral-lightGrey">-</span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {leadsStages.map((stage, idx) => (
              <Stage
                title={stage}
                isActive={idx == 0}
                isFirst={idx == 0}
                isLast={idx == leadsStages.length - 1}
                key={idx}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="success">Won</Button>
            <Button variant={'destructive'}>Lost</Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default LeadStages;
