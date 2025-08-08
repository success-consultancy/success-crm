'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';
import { ILead } from '@/types/response-types/leads-response';
import FileUploader from '@/components/organisms/file-uploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useEditLead } from '@/mutations/leads/edit-lead';
import { LeadSchemaType } from '@/schema/lead-schema';

const DocumentsSection = ({ lead }: { lead: ILead }) => {
  const [leadData, setLeadData] = useState<ILead>(lead);
  const getFileNameFromURL = (url: string) => decodeURIComponent(url.split('/').pop() || '');
  const getFileExtension = (fileName: string) => fileName.split('.').pop() || '';
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const editLead = useEditLead();

  const handleAddDocument = () => {
    setIsUploaderOpen(true);
  };
  useEffect(() => {
    const { createdAt, updatedAt, deletedAt, ...rest } = leadData;
    const payload = {
      ...rest,
      id: lead.id,
      hasVisitedStep: true,
    } as Omit<LeadSchemaType, 'serviceType'> & { serviceType: string; id: number; hasVisitedStep: boolean };
    editLead.mutate({
      ...payload,
    });
  }, [leadData]);

  return (
    <div className="border border-[#EBEBEB] rounded-lg shadow-sm mb-6">
      <div className="border-b border-[#EBEBEB] px-6 py-3 flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Documents</p>
        <div>
          {/* Remove hidden file input and FileUploader from here */}
          <Button variant="link" className="text-blue-600 px-0" onClick={handleAddDocument}>
            Add document
          </Button>
          <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <FileUploader
                onUploadComplete={(urls) => {
                  setLeadData({ ...leadData, files: [...(leadData?.files || []), urls[0]] });
                  setIsUploaderOpen(false);
                }}
                type="lead"
                maxFileSize={20}
                acceptedFiles={['PDF']}
              />
              <DialogClose asChild>
                <Button variant="outline" className="mt-4 w-full">
                  Cancel
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-0">
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
            {lead?.files?.map((doc, index) => {
              const fileName = getFileNameFromURL(doc);
              const fileExtension = getFileExtension(fileName);
              return (
                <TableRow key={index} className="text-neutral-darkGrey">
                  <TableCell className="text-gray-900 py-3 pl-6">{fileName}</TableCell>
                  <TableCell className="text-gray-900 py-3">{fileExtension}</TableCell>
                  <TableCell className="text-gray-900 py-3">{fileExtension}</TableCell>
                  <TableCell className="text-gray-900 py-3 pr-6">{new Date().toLocaleDateString('en-GB')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentsSection;
