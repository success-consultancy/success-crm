import { InfoField } from '@/components/atoms/info-field';
import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type ServiceDetailsProps = { lead: ILead };

const ServiceDetails = ({ lead }: ServiceDetailsProps) => {
  return (
    <TitleBox title="Service details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <InfoField title="Service type" value={lead.serviceType} />
        <InfoField title="Location" value={lead.location || 'N/A'} />
        <InfoField title="Source" value={lead.sourceId || 'N/A'} />
        {/* <InfoField title="Assign to" value={lead. || 'N/A'} /> */}
        <InfoField title="Status" value={lead.status || 'N/A'} />
      </div>
    </TitleBox>
  );
};

export default ServiceDetails;
