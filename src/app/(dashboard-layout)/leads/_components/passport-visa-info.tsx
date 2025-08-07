import SectionWrapper from '@/components/templates/section-wrapper';
import { Label } from '@/components/ui/label';

type Props = {};

enum PassportVisaKeys {
  country = 'Country',
  visa = 'Visa',
  visaExpiryDate = 'Visa expiry date',
  passportNumber = 'Passport number',
  issueDate = 'Issue date',
  expiryDate = 'Expiry date',
}

const passportVisaInfo = {
  country: 'Australia',
  visa: 'TSS Visa (482) - Small Business Sponsorship',
  visaExpiryDate: '22/02/2025',
  passportNumber: 'B7654321',
  issueDate: '22/02/2020',
  expiryDate: '22/02/2030',
};

const PassportVisaInfo = (props: Props) => {
  return (
    <SectionWrapper title="Passport & visa info">
      <div className="w-full grid grid-cols-3 gap-5">
        {Object.entries(passportVisaInfo).map(([key, value]) => {
          const label = PassportVisaKeys[key as keyof typeof PassportVisaKeys] ?? key;

          return (
            <div key={key} className="col-span-1 flex flex-col gap-2">
              <Label className="text-neutral-black text-sm font-semibold">{label}</Label>
              <span className="text-sm text-neutral-lightGrey">{value}</span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default PassportVisaInfo;
