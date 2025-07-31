'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';

type Document = {
  name: string;
  size: string;
  type: string;
  dateAdded: string;
};

const DocumentsSection = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: 'Visadocument_Draft.pdf',
      size: '4.89 KB',
      type: 'PDF',
      dateAdded: '11/08/2016',
    },
    {
      name: 'Document related to skill-assessment.tiff',
      size: '12.45 MB',
      type: 'TIFF',
      dateAdded: '24/12/2017',
    },
  ]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // TODO: Implement actual file upload logic here
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newDoc: Document = {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type.split('/').pop()?.toUpperCase() || 'DOC',
      dateAdded: new Date().toLocaleDateString('en-GB'),
    };

    setDocuments((prev) => [...prev, newDoc]);
    setUploading(false);
  };

  return (
    <div className="border border-[#EBEBEB] rounded-lg shadow-sm mb-6">
      <div className="border-b border-[#EBEBEB] px-6 py-3 flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Documents</p>
        <div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <Button variant="link" className="text-blue-600 px-0" onClick={handleAddDocument} disabled={uploading}>
            {uploading ? 'Uploading document…' : 'Add document'}
          </Button>
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
            {documents.map((doc, index) => (
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
  );
};

export default DocumentsSection;
