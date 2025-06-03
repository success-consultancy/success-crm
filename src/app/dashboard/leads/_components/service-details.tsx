import SectionWrapper from "@/components/common/section-wrapper";
import { Label } from "@/components/ui/label";

type Props = {};

enum ServiceDetailsKeys {
  serviceType = "Service type",
  location = "Location",
  source = "Source",
  assignedTo = "Assigned to",
  status = "Status",
}

const serviceDetails = {
  serviceType: "Education, Skill assessment, Tribunal",
  location: "Offshore",
  source: "Christopher",
  assignedTo: "Safalta, Bipin, Admond",
  status: "Converted",
};

const ServiceDetails = (props: Props) => {
  return (
    <SectionWrapper title="Service details">
      <div className="w-full grid grid-cols-3 gap-5">
        {Object.entries(serviceDetails).map(([key, value]) => {
          const label = ServiceDetailsKeys[key as keyof typeof ServiceDetailsKeys] ?? key;

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

export default ServiceDetails;

