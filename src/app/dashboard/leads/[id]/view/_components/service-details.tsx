import TitleBox from "./title-box"

type Props = {}

const serviceDetailsData = {
  serviceType: "Education, Skill assessment, Tribunal",
  location: "Offshore",
  source: "Christopher",
  assignedTo: "Safalta, Bipin, Admond",
  status: "Negotiation",
}

const ServiceDetails = (props: Props) => {
  const { serviceType, location, source, assignedTo, status } = serviceDetailsData
  return (
    <TitleBox title="Service details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Service type</span>
          <span className="text-gray-900 text-base font-medium">{serviceType}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Location</span>
          <span className="text-gray-900 text-base font-medium">{location}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Source</span>
          <span className="text-gray-900 text-base font-medium">{source}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Assigned to</span>
          <span className="text-gray-900 text-base font-medium">{assignedTo}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Status</span>
          <span className="text-gray-900 text-base font-medium">{status}</span>
        </div>
      </div>
    </TitleBox>
  )
}

export default ServiceDetails
