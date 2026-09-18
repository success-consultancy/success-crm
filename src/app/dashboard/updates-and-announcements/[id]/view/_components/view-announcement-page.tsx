'use client';

import { useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';
import { Pencil, Share2, Trash2, ArrowLeft } from 'lucide-react';
import useToast from '@/hooks/use-toast';
import { useGetAnnouncementById } from '@/query/get-announcements';
import { useDeleteAnnouncement } from '@/mutations/announcement/delete-announcement';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import PageLoader from '@/components/molecules/page-loader';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/atoms/button-link';
import { ROUTES } from '@/config/routes';
import { Share01, Share02, Share06 } from '@untitledui/icons';

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
  const toast = useToast();
  const { data: announcement, isLoading } = useGetAnnouncementById(id);
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

  if (isLoading) return <PageLoader />;
  if (!announcement) return null;

  const author = (announcement as any).user ?? announcement.User;
  const authorName = author ? `${author.firstName} ${author.lastName}` : '-';
  const authorInitials = author ? `${author.firstName?.[0] ?? ''}${author.lastName?.[0] ?? ''}` : '';

  const handleDelete = () => {
    deleteAnnouncement(announcement.id, {
      onSuccess: () => router.push(ROUTES.UPDATES_AND_ANNOUNCEMENTS),
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <Container className="flex flex-col py-10 gap-6">
      <Portal rootId={PortalIds.DashboardHeader}>
        <div className="flex items-center gap-4">
          <ButtonLink href={ROUTES.UPDATES_AND_ANNOUNCEMENTS} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Portal>

      <div className="bg-white rounded-xl p-10 py-[32px]">
        {/* Header — title, author, and actions */}
        <div className="flex flex-col gap-7">
          <h1 className="text-h4 font-semibold leading-8 text-neutral-black">{announcement.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-8">
                <AvatarFallback className="text-b14-600 bg-primary/10 text-primary">{authorInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-b14-500 text-neutral-black">{authorName}</p>
                <p className="text-b12-500 text-neutral-light-grey">{formatDate(announcement.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(ROUTES.EDIT_ANNOUNCEMENT(id))}
                className="h-10 w-10 text-neutral-light-grey hover:text-neutral-black"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-10 w-10 text-neutral-light-grey hover:text-neutral-black"
              >
                <Share06 className="h-5 w-5" />
              </Button>
              {/* <DeleteDialog
                trigger={
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-utility-red hover:text-utility-red/80">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                }
                title="Delete Announcement"
                description="Are you sure you want to delete this announcement? This action cannot be undone."
                onConfirm={handleDelete}
              /> */}
            </div>
          </div>
        </div>
        <hr className="mt-6 h-px w-full border-t border-neutral-border-light bg-neutral-border-light" />

        <div className='flex flex-col sm:flex-row gap-4 justify-between mt-8'>
          {/* Content */}
          <div
            className="text-b16 text-neutral-dark-grey max-w-[624px] xl:max-w-[900px]
            [&_p]:mb-8 [&_p:last-child]:mb-0
            [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-700 [&_a]:break-words
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8
            [&_li]:mb-1
            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2
            [&_strong]:font-semibold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: announcement.description }}
          />

          {/* Cover image — breaks out to full card width */}
          {announcement.photoURL && (
            <div className="w-full sm:w-[400px] sm:shrink-0 overflow-hidden rounded-[8px]">
              <img
                src={announcement.photoURL}
                alt={announcement.title}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[400/280] object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ViewAnnouncementPage;
