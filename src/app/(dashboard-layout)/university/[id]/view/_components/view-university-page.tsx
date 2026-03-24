'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useGetUniversityById } from '@/query/get-university';
import { useGetCourse } from '@/query/get-course';
import { useDeleteUniversity } from '@/mutations/university/delete-university';
import { useEditUniversity } from '@/mutations/university/edit-university';
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
import { UploadedFileMeta } from '@/types/common';
import { toast } from 'sonner';

type Props = { id: string };

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileType = (name: string) => {
  const ext = name.split('.').pop()?.toUpperCase();
  return ext || '-';
};

const ViewUniversityPage = ({ id }: Props) => {
  const router = useRouter();
  const { data: university, isLoading, refetch } = useGetUniversityById(id);
  const { data: allCourses } = useGetCourse(Number(id));
  const { mutate: deleteUniversity } = useDeleteUniversity();
  const { mutate: editUniversity } = useEditUniversity();
  const [showUploader, setShowUploader] = useState(false);

  if (isLoading) return <PageLoader />;
  if (!university) return null;

  const rawFiles = university.files;
  const files: UploadedFileMeta[] = Array.isArray(rawFiles)
    ? (rawFiles as UploadedFileMeta[])
    : typeof rawFiles === 'string'
      ? (() => { try { const p = JSON.parse(rawFiles); return Array.isArray(p) ? p : []; } catch { return []; } })()
      : [];
  const linkedCourses = (allCourses || []).filter((c) => c.universityId === university.id);

  const handleDelete = () => {
    deleteUniversity(university.id, {
      onSuccess: () => router.push(ROUTES.UNIVERSITY),
    });
  };

  const handleAddDocument = (newFiles: UploadedFileMeta[]) => {
    const merged = [...files, ...newFiles];
    editUniversity(
      { id: university.id, files: merged, name: university.name },
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

  return (
    <Container className="flex flex-col py-10 gap-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.UNIVERSITY} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">{university.name}</h3>
        </div>
      </Portal>

      {/* Details Card */}
      <div className="bg-white rounded-lg border border-[#EBEBEB]">
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-3">
          <p className="text-xl font-bold">University details</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/university/${id}/edit`)}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <DeleteDialog
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              title="Delete University"
              description="Are you sure you want to delete this university? This action cannot be undone."
              onConfirm={handleDelete}
            />
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-6">
          <InfoField title="University name" value={university.name} />
          <InfoField title="Group" value={university.educationLevel || '-'} />
          <InfoField title="Location" value={university.location || '-'} />
          {linkedCourses.length > 0 && (
            <div className="col-span-3">
              <span className="text-neutral-black text-b14-600 font-medium">Available courses</span>
              <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-1 list-disc list-inside">
                {linkedCourses.map((course) => (
                  <li key={course.id} className="text-sm text-gray-700">
                    {course.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <InfoField title="Comment" value={university.comment || '-'} />
        </div>
      </div>

      {/* Description */}
      {university.description && (
        <div className="bg-white rounded-lg border border-[#EBEBEB]">
          <div className="border-b border-[#EBEBEB] px-6 py-3">
            <p className="text-xl font-bold">Description</p>
          </div>
          <div
            className="p-6 text-sm text-neutral-dark-grey prose max-w-none"
            dangerouslySetInnerHTML={{ __html: university.description }}
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
              type="university"
              maxFileSize={10}
              acceptedFiles={['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.tiff', '.tif']}
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
                    <span className="flex items-center gap-1">
                      Document name <ChevronDown className="h-3 w-3" />
                    </span>
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

export default ViewUniversityPage;
