import SectionWrapper from "@/components/templates/section-wrapper";
import { Label } from "@/components/ui/label";

type Props = {};

enum PersonalDetailsKeys {
  firstName = "First Name",
  middleName = "Middle Name",
  lastName = "Last Name",
  emailAddress = "Email Address",
  phoneNumber = "Phone Number",
  birthDate = "Birth Date",
  address = "Address",
  occupation = "Occupation",
  anzsco = "ANZSCO",
  qualification = "Qualification",
}

const personalDetails = {
  firstName: "Bartholomew",
  middleName: null,
  lastName: "Macquarie-Wilkinson",
  emailAddress: "bartholomew@gmail.com",
  phoneNumber: "+61 0928 5153 8368",
  birthDate: "2000-02-22",
  address: null,
  occupation: [
    "Defence Force Senior Officer",
    "Managing Director",
    "Corporate General Manager",
  ],
  anzsco: ["111213", "111211", "111111"],
  qualification: "Masters in Computer Science",
};

const PersonalDetails = (props: Props) => {
  return (
    <SectionWrapper title="Personal Details">
      <div className="w-full grid grid-cols-3 gap-5">
        {Object.entries(personalDetails).map(([key, value]) => {
          const label =
            PersonalDetailsKeys[key as keyof typeof PersonalDetailsKeys] ?? key;

          const formattedValue =
            value === null
              ? "N/A"
              : Array.isArray(value)
                ? value.join(", ")
                : value;

          return (
            <div key={key} className="col-span-1 flex flex-col gap-2">
              <Label className="text-neutral-black text-sm font-semibold">
                {label}
              </Label>
              <span className="text-sm text-neutral-lightGrey">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default PersonalDetails;
