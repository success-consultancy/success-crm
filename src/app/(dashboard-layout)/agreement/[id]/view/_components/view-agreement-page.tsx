'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';
import { Pencil, Mail, Trash2, ChevronDown } from 'lucide-react';
import { useGetAgreementById } from '@/query/get-agreements';
import { useDeleteAgreement } from '@/mutations/agreement/delete-agreement';
import { useEditAgreement } from '@/mutations/agreement/edit-agreement';
import { InfoField } from '@/components/atoms/info-field';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import PageLoader from '@/components/molecules/page-loader';
import DeleteDialog from '@/components/organisms/delete.dialog';
import FileUploader from '@/components/organisms/file-uploader';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { AGREEMENT_STATUS_COLORS } from '@/types/response-types/agreement-response';
import { UploadedFileMeta } from '@/types/common';
import { toast } from 'sonner';

type Props = { id: string };

const formatDate = (date: string | null) => {
  if (!date) return '-';
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return '-';
    return format(parsed, 'dd/MM/yyyy');
  } catch {
    return '-';
  }
};

const getFileType = (name: string) => {
  const ext = name.split('.').pop()?.toUpperCase();
  return ext || '-';
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ViewAgreementPage = ({ id }: Props) => {
  const router = useRouter();
  const { data: agreement, isLoading, refetch } = useGetAgreementById(id);
  const { mutate: deleteAgreement } = useDeleteAgreement();
  const { mutate: editAgreement } = useEditAgreement();
  const [showUploader, setShowUploader] = useState(false);

  if (isLoading) return <PageLoader />;
  if (!agreement) return null;

  const files: UploadedFileMeta[] = agreement.files || [];

  const handleDelete = () => {
    deleteAgreement(agreement.id, {
      onSuccess: () => router.push(ROUTES.AGENCY_AGREEMENT),
    });
  };

  const handleAddDocument = (newFiles: UploadedFileMeta[]) => {
    const merged = [...files, ...newFiles];
    editAgreement(
      { id: agreement.id, files: merged, universityId: agreement.universityId, status: agreement.status },
      {
        onSuccess: () => {
          toast.success('Document added successfully');
          setShowUploader(false);
          refetch();
        },
        onError: () => toast.error('Failed to add document'),
      },
    );
  };

  const statusColors = AGREEMENT_STATUS_COLORS[agreement.status] ?? { bg: '#f3f4f6', text: '#374151' };


  return (
    <Container className="flex flex-col py-10 gap-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.AGENCY_AGREEMENT} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">{agreement.university?.name || 'Agreement'}</h3>
        </div>
      </Portal>

      {/* Details Card */}
      <div className="bg-white rounded-lg border border-[#EBEBEB]">
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-3">
          <p className="text-xl font-bold">Agency agreement details</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/agreement/${id}/edit`)}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
              <Mail className="h-4 w-4" />
            </Button>
            <DeleteDialog
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              title="Delete Agreement"
              description="Are you sure you want to delete this agreement? This action cannot be undone."
              onConfirm={handleDelete}
            />
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-6">
          <InfoField title="ID" value={String(agreement.id)} />
          <InfoField title="University name" value={agreement.university?.name || '-'} />
          <InfoField title="Type" value={agreement.type || '-'} />
          <InfoField title="Group" value={agreement.group || '-'} />
          <InfoField title="Location" value={agreement.location || '-'} />
          <InfoField title="Web link" value={agreement.webLink || '-'} />
          <InfoField title="Start date" value={formatDate(agreement.startDate)} />
          <InfoField title="End date" value={formatDate(agreement.endDate)} />
          <InfoField title="Commission %" value={agreement.commission ? `${agreement.commission}%` : '-'} />
          <div className="flex flex-col">
            <span className="text-neutral-black text-b14-600">Status</span>
            <div>
              <span
                className="text-b14 px-2 py-1 rounded-[2px] inline-flex text-xs font-medium"
                style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
              >
                {agreement.status || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Note Card */}
      {agreement.note && (
        <div className="bg-white rounded-lg border border-[#EBEBEB]">
          <div className="border-b border-[#EBEBEB] px-6 py-3">
            <p className="text-xl font-bold">Note</p>
          </div>
          <div
            className="p-6 text-sm text-neutral-dark-grey prose max-w-none"
            dangerouslySetInnerHTML={{ __html: agreement.note }}
          />
        </div>
      )}

      {/* Documents Card */}
      <div className="bg-white rounded-lg border border-[#EBEBEB]">
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-3">
          <p className="text-xl font-bold">Documents</p>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 font-medium p-0 h-auto"
            onClick={() => setShowUploader((v) => !v)}
          >
            Add document
          </Button>
        </div>

        {showUploader && (
          <div className="px-6 pt-4">
            <FileUploader
              type="agreement"
              maxFileSize={10}
              acceptedFiles={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.tiff', '.tif']}
              onUploadComplete={handleAddDocument}
            />
          </div>
        )}

        <div className="p-6">
          {files.length === 0 ? (
            <p className="text-sm text-gray-400">No documents attached.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EBEBEB]">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">
                    <span className="flex items-center gap-1">Document name <ChevronDown className="h-3 w-3" /></span>
                  </th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Size</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date added</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, i) => (
                  <tr key={i} className="border-b border-[#EBEBEB] last:border-0">
                    <td className="py-3 px-3">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-gray-800"
                      >
                        {file.name}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{formatSize(file.size)}</td>
                    <td className="py-3 px-3 text-gray-600">{getFileType(file.name)}</td>
                    <td className="py-3 px-3 text-gray-600">
                      {file.addedDate ? format(new Date(file.addedDate), 'dd/MM/yyyy') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ViewAgreementPage;
