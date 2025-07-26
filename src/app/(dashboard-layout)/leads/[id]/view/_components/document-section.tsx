import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown } from "lucide-react"

type Props = {}

const documentsData = [
  {
    name: "Visadocument_Draft.pdf",
    size: "4.89 KB",
    type: "PDF",
    dateAdded: "11/08/2016",
  },
  {
    name: "Document related to skill-assessment.tiff",
    size: "12.45 MB",
    type: "TIFF",
    dateAdded: "24/12/2017",
  },
]

const DocumentsSection = (props: Props) => {
  return (
    <div className="border border-[#EBEBEB] rounded-lg shadow-sm mb-6">
      <div className="border-b border-[#EBEBEB] px-6 py-3 flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Documents</p>
        <Button variant="link" className="text-blue-600 px-0">
          Add document
        </Button>
      </div>
      <div className="p-0">
        {" "}
        {/* Removed p-6 here as table handles its own padding */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-800 text-sm font-medium py-3 pl-6">
                <div className="flex items-center gap-1">
                  Document name
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </TableHead>
              <TableHead className="text-gray-800 text-sm font-medium py-3">Size</TableHead>
              <TableHead className="text-gray-800 text-sm font-medium py-3">Type</TableHead>
              <TableHead className="text-gray-800 text-sm font-medium py-3 pr-6">Date added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentsData.map((doc, index) => (
              <TableRow key={index} className="text-neutral-darkGrey">
                <TableCell className="text-gray-900 py-3 pl-6">{doc.name}</TableCell>
                <TableCell className="text-gray-900 py-3">{doc.size}</TableCell>
                <TableCell className="text-gray-900 py-3">{doc.type}</TableCell>
                <TableCell className="text-gray-900 py-3 pr-6">{doc.dateAdded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DocumentsSection
