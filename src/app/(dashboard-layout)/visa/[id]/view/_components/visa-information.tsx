import { IVisa } from '@/types/response-types/visa-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type VisaInformationProps = { visa: IVisa };

const VisaInformation = ({ visa }: VisaInformationProps) => {
  // TODO : Need to put actual data from the API
  const v = {
    currentVisa: 'N/A', // visa.currentVisa
    proposedVisa: 'N/A', // visa.proposedVisa
    sponsorName: 'Unknown', // visa.sponsorName
    sbsTasStatus: 'Not available', // visa.sbsTasStatus
    nominationStatus: 'Not available', // visa.nominationStatus
    status: 'Pending', // visa.status
    visaExpiry: null, // visa.visaExpiry
    visaStream: 'Not specified', // visa.visaStream

    sponsorEmail: 'not provided', // visa.sponsorEmail
    visaSubmitted: null, // visa.visaSubmitted
    nominationLodged: null, // visa.nominationLodged
    dueDate: null, // visa.dueDate
    occupation: 'Unknown', // visa.occupation
    sponsorPhone: 'Not provided', // visa.sponsorPhone
    visaGranted: null, // visa.visaGranted
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
