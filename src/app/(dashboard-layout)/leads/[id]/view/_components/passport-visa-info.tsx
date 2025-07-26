import TitleBox from "./title-box"

type Props = {}

const passportVisaData = {
  country: "Australia",
  visa: "TSS Visa (482) - Small Business Sponsorship",
  visaExpiryDate: "22/02/2025",
  passportNumber: "B7654321",
  issueDate: "22/02/2020",
  expiryDate: "22/02/2030",
}

const PassportVisaInfo = (props: Props) => {
  const { country, visa, visaExpiryDate, passportNumber, issueDate, expiryDate } = passportVisaData
  return (
    <TitleBox title="Passport & visa info">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Country</span>
          <span className="text-gray-900 text-base font-medium">{country}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Visa</span>
          <span className="text-gray-900 text-base font-medium">{visa}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Visa expiry date</span>
          <span className="text-gray-900 text-base font-medium">{visaExpiryDate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Passport number</span>
          <span className="text-gray-900 text-base font-medium">{passportNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Issue date</span>
          <span className="text-gray-900 text-base font-medium">{issueDate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Expiry date</span>
          <span className="text-gray-900 text-base font-medium">{expiryDate}</span>
        </div>
      </div>
    </TitleBox>
  )
}

export default PassportVisaInfo
