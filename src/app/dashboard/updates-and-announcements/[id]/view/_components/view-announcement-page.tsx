'use client';

import { useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { useGetAnnouncementById } from '@/query/get-announcements';
import { useDeleteAnnouncement } from '@/mutations/announcement/delete-announcement';
import { InfoField } from '@/components/atoms/info-field';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import PageLoader from '@/components/molecules/page-loader';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';

type Props = { id: string };

const formatDate = (date: string | null) => {
  if (!date) return '-';
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return '-';
    return format(parsed, 'MMM dd, yyyy');
  } catch {
    return '-';
  }
};

const ViewAnnouncementPage = ({ id }: Props) => {
  const router = useRouter();
  const { data: announcement, isLoading } = useGetAnnouncementById(id);
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

  if (isLoading) return <PageLoader />;
  if (!announcement) return null;

  const author = (announcement as any).user ?? announcement.User;
  const authorName = author ? `${author.firstName} ${author.lastName}` : '-';

  const handleDelete = () => {
    deleteAnnouncement(announcement.id, {
      onSuccess: () => router.push(ROUTES.UPDATES_AND_ANNOUNCEMENTS),
    });
  };

  return (
    <Container className="flex flex-col py-10 gap-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.UPDATES_AND_ANNOUNCEMENTS} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
          <h3 className="text-h5 text-content-heading font-bold">{announcement.title}</h3>
        </div>
      </Portal>

      {/* Cover Image — full-width hero banner */}
      {announcement.photoURL && (
        <div className="rounded-lg overflow-hidden border border-[#EBEBEB]">
          <img
            src={announcement.photoURL}
            alt={announcement.title}
            className="w-full h-72 object-cover"
          />
        </div>
      )}

      {/* Details Card */}
      <div className="bg-white rounded-lg border border-[#EBEBEB]">
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-6 py-3">
          <p className="text-xl font-bold">Announcement details</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.EDIT_ANNOUNCEMENT(id))}
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
              title="Delete Announcement"
              description="Are you sure you want to delete this announcement? This action cannot be undone."
              onConfirm={handleDelete}
            />
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-6">
          <InfoField title="ID" value={String(announcement.id)} />
          <InfoField title="Author" value={authorName} />
          <InfoField title="Published" value={formatDate(announcement.createdAt)} />
          <InfoField title="Last updated" value={formatDate(announcement.updatedAt)} />
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-lg border border-[#EBEBEB]">
        <div className="border-b border-[#EBEBEB] px-6 py-3">
          <p className="text-xl font-bold">Content</p>
        </div>
        <div
          className="p-6 text-sm text-neutral-dark-grey max-w-none leading-relaxed
            [&_p]:mb-3 [&_p:last-child]:mb-0
            [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-700 [&_a]:break-words
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
            [&_li]:mb-1
            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2
            [&_strong]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: announcement.description }}
        />
      </div>
    </Container>
  );
};

export default ViewAnnouncementPage;
