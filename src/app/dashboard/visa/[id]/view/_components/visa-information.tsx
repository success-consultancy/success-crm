import { IVisa, IVisaDetail } from '@/types/response-types/visa-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type VisaInformationProps = { visa: IVisaDetail };

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
    visaSubmitted: visa.visaSubmitted || '-',
    nominationLodged: visa.nominationLodged || '-',
    dueDate: visa.dueDate || '-',
    occupation: visa.occupation || '-',
    sponsorPhone: visa.sponsorPhone || '-',
    visaGranted: visa.visaGranted || '-',
  };

  return (
    <TitleBox title="Visa information">
      <div className="grid grid-cols-3 gap-6">
        <InfoField title="Current visa" value={v.currentVisa} />
        <InfoField title="Proposed visa" value={v.proposedVisa} />
        <InfoField title="Sponsor name" value={v.sponsorName} />
        <InfoField title="SBS/TAS status" value={v.sbsTasStatus} />
        <InfoField title="Nomination status" value={v.nominationStatus} />
        <InfoField title="Visa status" value={v.status} />
        <InfoField
          title="Visa expiry date"
          value={v.visaExpiry ? new Date(v.visaExpiry).toLocaleDateString() : 'N/A'}
        />
        <InfoField title="Visa stream" value={v.visaStream} />
        <InfoField title="Sponsor email" value={v.sponsorEmail} />
        <InfoField
          title="Date submitted"
          value={v.visaSubmitted ? new Date(v.visaSubmitted).toLocaleDateString() : 'N/A'}
        />
        <InfoField
          title="Nomination date submitted"
          value={v.nominationLodged ? new Date(v.nominationLodged).toLocaleDateString() : 'N/A'}
        />
        <InfoField
          title="Visa date submitted"
          value={v.visaSubmitted ? new Date(v.visaSubmitted).toLocaleDateString() : 'N/A'}
        />
        <InfoField title="Due date" value={v.dueDate ? new Date(v.dueDate).toLocaleDateString() : 'N/A'} />
        <InfoField title="Occupation" value={v.occupation} />
        <InfoField title="Sponsor phone" value={v.sponsorPhone} />
        <InfoField
          title="Decision date"
          value={v.visaGranted ? new Date(v.visaGranted).toLocaleDateString() : 'N/A'}
        />
      </div>
    </TitleBox>
  );
};

export default VisaInformation;
