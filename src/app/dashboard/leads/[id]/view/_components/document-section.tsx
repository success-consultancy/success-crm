'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, Trash2 } from 'lucide-react';
import { ILead } from '@/types/response-types/leads-response';
import FileUploader from '@/components/organisms/file-uploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { useEditLead } from '@/mutations/leads/edit-lead';
import { LeadSchemaType } from '@/schema/lead-schema';
import { FilePreviewDialog } from '@/components/organisms/preview-model';
import { UploadedFileMeta } from '@/types/common';
import { formatFileSize } from '@/utils/file';

const DocumentsSection = ({ lead }: { lead: ILead }) => {
  const [leadData, setLeadData] = useState<ILead>(lead);
  const getFileNameFromURL = (url: string) => decodeURIComponent(url.split('/').pop() || '');
  const getFileExtension = (fileName: string) => fileName.split('.').pop() || '';
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [preview, setPreview] = useState<{
    url: string;
    name: string;
    type: 'image' | 'pdf' | 'other';
  } | null>(null);
  type LeadFile = {
    url: string;
    addedDate: string;
    size: number;
  };

  const editLead = useEditLead();

  // Keep local state in sync with the latest lead (e.g. after a save refetch).
  useEffect(() => {
    setLeadData(lead);
  }, [lead]);

  const handleAddDocument = () => {
    setIsUploaderOpen(true);
  };

  const persistFiles = (updatedFiles: ILead['files']) => {
    setLeadData({ ...leadData, files: updatedFiles });

    const { createdAt, updatedAt, deletedAt, clientIds, leadStage, leadStageHistory, source, user, ...rest } = leadData;
    const payload = {
      ...rest,
      id: lead.id,
      hasVisitedStep: true,
      files: updatedFiles,
    } as Omit<LeadSchemaType, 'serviceType'> & { serviceType: string; id: number; hasVisitedStep: boolean };

    editLead.mutate({ ...payload });
  };

  const handleRemoveDocument = (fileUrl: string) => {
    const updatedFiles = (leadData?.files || []).filter((f) => f.url !== fileUrl);
    persistFiles(updatedFiles);
  };

  const handleDocumentUpload = (files: UploadedFileMeta[]) => {
    const updatedFiles = [...(leadData?.files || []), ...files] as ILead['files'];
    persistFiles(updatedFiles);
    setIsUploaderOpen(false);
  };

  const getFileType = (ext: string) => {
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'other';
  };

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
                onUploadComplete={handleDocumentUpload}
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
              <TableHead className="text-gray-800 text-sm font-medium py-3">Date added</TableHead>
              <TableHead className="text-gray-800 text-sm font-medium py-3 pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadData?.files?.map((doc, index) => {
              const fileName = doc.name || getFileNameFromURL(doc as any);

              const fileExtension = getFileExtension(fileName || '');
              const fileType = getFileType(fileExtension || '');
              const fileSize = formatFileSize(doc.size) || 0;
              return (
                <TableRow key={index}>
                  <TableCell
                    onClick={() =>
                      setPreview({
                        url: doc.url,
                        name: fileName,
                        type: fileType,
                      })
                    }
                    className="pl-6 text-primary underline hover:opacity-80"
                  >
                    {fileName}
                  </TableCell>
                  <TableCell>{fileSize}</TableCell>
                  <TableCell>{fileExtension}</TableCell>
                  <TableCell>{new Date(doc.addedDate).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <DeleteDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          disabled={editLead.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title="Remove Document"
                      description={`Are you sure you want to remove "${fileName}"? This action cannot be undone.`}
                      onConfirm={() => handleRemoveDocument(doc.url)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {preview && (
          <FilePreviewDialog
            open={!!preview}
            onOpenChange={(open) => !open && setPreview(null)}
            fileUrl={preview.url}
            fileName={preview.name}
            fileType={preview.type}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;
