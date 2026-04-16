import { ITribunalReview } from '@/types/response-types/tribunal-review-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type VisaInformationProps = { visa: ITribunalReview };

const VisaInformation = ({ visa }: VisaInformationProps) => {
  const v = {
    currentVisa: visa.currentVisa || '-',
    proposedVisa: visa.proposedVisa || '-',
    sponsorName: visa.sponsorName || '-',
    sbsTasStatus: visa.sbsStatus || '-',
    nominationStatus: visa.nominationStatus || '-',
    status: visa.status || '-',
    visaExpiry: visa.visaExpiry || '-',
    visaStream: visa.visaStream || '-',

    sponsorEmail: visa.sponsorEmail || '-',
    nominationLodged: visa.nominationSubmittedDate || '-',
    dueDate: visa.dueDate || '-',
    occupation: visa.occupation || '-',
    sponsorPhone: visa.sponsorPhone || '-',
    visaGranted: visa.visaDecisionDate || '-',
    visaSubmittedDate: visa.visaSubmittedDate || '-',
    nominationSubmittedDate: visa.nominationSubmittedDate || '-',
    visaDecisionDate: visa.visaDecisionDate || '-',
  };

  return (
    <TitleBox title="Visa information">
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1 */}
        <InfoField title="Current visa" value={v.currentVisa} />
        <InfoField title="Visa expiry date" value={v.visaExpiry} />
        <InfoField title="Visa due date" value={v.dueDate} />
        <InfoField title="Proposed visa" value={v.proposedVisa} />
        <InfoField title="Visa stream" value={v.visaStream} />
        <InfoField title="Occupation" value={v.occupation} />
        <InfoField title="Sponsor name" value={v.sponsorName} />
        <InfoField title="Sponsor email" value={v.sponsorEmail} />
        <InfoField title="Sponsor phone" value={v.sponsorPhone} />

        <InfoField title="SBS/TAS status" value={v.sbsTasStatus} type="badge" badgeColor="#C3F8FE" />
        <InfoField title="Date submitted" value={v.visaSubmittedDate ? new Date(v.visaSubmittedDate).toLocaleDateString() : 'N/A'} />
        <InfoField title="Date decision" value={v.visaDecisionDate ? new Date(v.visaDecisionDate).toLocaleDateString() : 'N/A'} />

        {/* Column 2 */}
        <InfoField title="Nomination status" value={v.nominationLodged} type="badge" badgeColor="#CCE0FF" />
        <InfoField
          title="Nomination date submitted"
          value={v.nominationSubmittedDate ? new Date(v.nominationSubmittedDate).toLocaleDateString() : 'N/A'}
        />
        <InfoField
          title="Nomination decision date"
          value={v.nominationSubmittedDate ? new Date(v.nominationSubmittedDate).toLocaleDateString() : 'N/A'}
        />
        <InfoField title="Visa status" value={v.status} type="badge" badgeColor="#BAF3" />
        <InfoField title="Visa date submitted" value={v.visaSubmittedDate ? new Date(v.visaSubmittedDate).toLocaleDateString() : 'N/A'} />
        <InfoField title="Visa granted date" value={v.visaGranted ? new Date(v.visaGranted).toLocaleDateString() : 'N/A'} />
      </div>
    </TitleBox>
  );
};

export default VisaInformation;
