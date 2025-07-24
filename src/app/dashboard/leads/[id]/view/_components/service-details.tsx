import TitleBox from "./title-box"
import { ILead } from "@/types/response-types/leads-response"

type Props = {
  lead: ILead
}

const ServiceDetails = ({ lead }: Props) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  }

  return (
    <TitleBox title="Service details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Service type</span>
          <span className="text-gray-900 text-base font-medium">{lead.serviceType || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Location</span>
          <span className="text-gray-900 text-base font-medium">{lead.location || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Source ID</span>
          <span className="text-gray-900 text-base font-medium">{lead.sourceId || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Assigned to (User ID)</span>
          <span className="text-gray-900 text-base font-medium">{lead.userId || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Status</span>
          <span className="text-gray-900 text-base font-medium">{lead.status}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Follow up date</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.followUpDate)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Created at</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.createdAt)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-800 text-sm">Updated at</span>
          <span className="text-gray-900 text-base font-medium">{formatDate(lead.updatedAt)}</span>
        </div>
      </div>
    </TitleBox>
  )
}

export default ServiceDetails
