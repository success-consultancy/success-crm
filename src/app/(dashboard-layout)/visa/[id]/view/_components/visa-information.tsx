import { IVisa } from '@/types/response-types/visa-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type VisaInformationProps = { visa: IVisa };

const VisaInformation = ({ visa }: VisaInformationProps) => {
  const v = {
    currentVisa: visa.currentVisa || 'N/A',
    proposedVisa: visa.proposedVisa || 'N/A',
    sponsorName: visa.sponsorName || 'Unknown',
    sbsTasStatus: visa.sbsTasStatus || 'Not available',
    nominationStatus: visa.nominationStatus || 'Not available',
    status: visa.status || 'Pending',
    visaExpiry: visa.visaExpiry || null,
    visaStream: visa.visaStream || 'Not specified',

    sponsorEmail: visa.sponsorEmail || 'not provided',
    visaSubmitted: visa.visaSubmitted || null,
    nominationLodged: visa.nominationLodged || null,
    dueDate: visa.dueDate || null,
    occupation: visa.occupation || 'Unknown',
    sponsorPhone: visa.sponsorPhone || 'Not provided',
    visaGranted: visa.visaGranted || null,
  };

  return (
    <TitleBox title="Visa information">
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
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
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
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
      </div>
    </TitleBox>
  );
};

export default VisaInformation;
