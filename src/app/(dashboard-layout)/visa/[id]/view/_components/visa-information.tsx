import { IVisa } from '@/types/response-types/visa-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';

type VisaInformationProps = { visa: IVisa };

const VisaInformation = ({ visa }: VisaInformationProps) => {
  return (
    <TitleBox title="Visa information">
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <InfoField title="Current visa" value={visa.currentVisa || '-'} />
          <InfoField title="Proposed visa" value={visa.proposedVisa || '-'} />
          <InfoField title="Sponsor name" value={visa.sponsorName || '-'} />
          <InfoField title="SBS/TAS status" value={visa.sbsTasStatus || '-'} />
          <InfoField title="Nomination status" value={visa.nominationStatus || '-'} />
          <InfoField title="Visa status" value={visa.status || '-'} />
          <InfoField
            title="Visa expiry date"
            value={visa.visaExpiry ? new Date(visa.visaExpiry).toLocaleDateString() : '-'}
          />
          <InfoField title="Visa stream" value={visa.visaStream || '-'} />
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <InfoField title="Sponsor email" value={visa.sponsorEmail || '-'} />
          <InfoField
            title="Date submitted"
            value={visa.visaSubmitted ? new Date(visa.visaSubmitted).toLocaleDateString() : '-'}
          />
          <InfoField
            title="Nomination date submitted"
            value={visa.nominationLodged ? new Date(visa.nominationLodged).toLocaleDateString() : '-'}
          />
          <InfoField
            title="Visa date submitted"
            value={visa.visaSubmitted ? new Date(visa.visaSubmitted).toLocaleDateString() : '-'}
          />
          <InfoField title="Due date" value={visa.dueDate ? new Date(visa.dueDate).toLocaleDateString() : '-'} />
          <InfoField title="Occupation" value={visa.occupation || '-'} />
          <InfoField title="Sponsor phone" value={visa.sponsorPhone || '-'} />
          <InfoField
            title="Decision date"
            value={visa.visaGranted ? new Date(visa.visaGranted).toLocaleDateString() : '-'}
          />
        </div>
      </div>
    </TitleBox>
  );
};

export default VisaInformation;
