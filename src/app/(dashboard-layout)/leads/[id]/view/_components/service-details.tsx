import TitleBox from './title-box';
import { ILead } from '@/types/response-types/leads-response';

type ServiceDetailsProps = { lead: ILead };

const ServiceDetails = ({ lead }: ServiceDetailsProps) => {
  return (
    <TitleBox title="Service details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Service type</span>
          <span className="text-gray-900 text-base font-medium">{lead.serviceType || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Location</span>
          <span className="text-gray-900 text-base font-medium">{lead.location || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Source ID</span>
          <span className="text-gray-900 text-base font-medium">{lead.sourceId || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Status</span>
          <span className="text-gray-900 text-base font-medium">{lead.status || '-'}</span>
        </div>
      </div>
    </TitleBox>
  );
};

export default ServiceDetails;
