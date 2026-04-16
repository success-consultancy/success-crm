import { ITribunalReview } from '@/types/response-types/tribunal-review-response';
import TitleBox from './title-box';
import { InfoField } from '@/components/atoms/info-field';
import { IInsurance } from '@/types/response-types/insurance-response';

type VisaInformationProps = { insurance: IInsurance };

const VisaInformation = ({ insurance }: VisaInformationProps) => {
  const v = {
    currentVisa: insurance.currentVisa || '-',
    status: insurance.status || '-',
    visaExpiry: insurance.visaExpiry || '-',
    visaStream: insurance.visaStream || '-',
    startDate: insurance.startDate || '-',
    expiryDate: insurance.expiryDate || '-',
    policyNumber: insurance.policyNumber || '-',
    insuranceProvider: insurance.insuranceProvider || '-',
    insuranceType: insurance.insuranceType || '-',
    dueDate: insurance.dueDate || '-',
  };

  return (
    <TitleBox title="Visa & insurance details">
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1 */}
        <InfoField title="Current visa" value={v.currentVisa} />
        <InfoField title="Visa expiry date" value={v.visaExpiry} />
        <InfoField title="Due date" value={v.dueDate} />
        <InfoField title="Visa stream" value={v.visaStream} />
        <InfoField title="Current insurance provider" value={v.insuranceProvider} />
        <InfoField title="Policy number" value={v.policyNumber} />
        <InfoField title="Policy type" value={v.insuranceType} />

        <InfoField title="Policy start date" value={v.startDate ? new Date(v.startDate).toLocaleDateString() : 'N/A'} />
        <InfoField title="Policy end date" value={v.expiryDate ? new Date(v.expiryDate).toLocaleDateString() : 'N/A'} />

        <InfoField title="Status" value={v.status} type="badge" badgeColor="#CCE0FF" />
      </div>
    </TitleBox>
  );
};

export default VisaInformation;
