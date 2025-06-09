import LeadsDetailsNote from '../leads/_components/leads-detail-note';
import LeadsDocumentsTable from '../leads/_components/leads-documents';
import LeadStages from '../leads/_components/leads-stages';
import PassportVisaInfo from '../leads/_components/passport-visa-info';
import PersonalDetails from '../leads/_components/personal-details';
import ServiceDetails from '../leads/_components/service-details';

const LeadsOverview = () => {
  return (
    <div className="space-y-4">
      <LeadStages />
      <PersonalDetails />
      <PassportVisaInfo />
      <ServiceDetails />
      <LeadsDetailsNote />
      <LeadsDocumentsTable />
    </div>
  );
};

export default LeadsOverview;
