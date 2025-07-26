import TitleBox from "./title-box"

type Props = {}

const personalDetailsData = {
  firstName: "Bartholomew",
  middleName: "N/A",
  lastName: "Macquarie-Wilkinson",
  email: "bartholomew@gmail.com",
  phone: "+61 0928 5153 8368",
  birthDate: "22/02/2000",
  address: "N/A",
  occupation: "Defence Force Senior Officer, Managing Director, Corporate General Manager",
  anzsco: "111213, 111211, 111111",
  qualification: "Masters in Computer Science"
}

const PersonalDetails = (props: Props) => {
  const { firstName, middleName, lastName, email, phone, birthDate, address, occupation, anzsco, qualification } = personalDetailsData

  return (
    <TitleBox title="Personal details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">First name</span>
          <span className="text-gray-900 text-base font-medium">{firstName}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Middle name</span>
          <span className="text-gray-900 text-base font-medium">{middleName}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Last name</span>
          <span className="text-gray-900 text-base font-medium">{lastName}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Email address</span>
          <span className="text-gray-900 text-base font-medium">{email}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Phone number</span>
          <span className="text-gray-900 text-base font-medium">{phone}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Birth date</span>
          <span className="text-gray-900 text-base font-medium">{birthDate}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Address</span>
          <span className="text-gray-900 text-base font-medium">{address}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Occupation</span>
          <span className="text-gray-900 text-base font-medium">{occupation}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">ANZSCO</span>
          <span className="text-gray-900 text-base font-medium">{anzsco}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-800 text-sm">Qualification</span>
        <span className="text-gray-900 text-base font-medium block">{qualification}</span>
      </div>

    </TitleBox>
  )
}

export default PersonalDetails
