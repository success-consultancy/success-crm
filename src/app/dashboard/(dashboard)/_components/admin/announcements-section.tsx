'use client';

import React from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetAnnouncements } from '@/query/get-announcements';
import { Megaphone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';

const AnnouncementsSection = () => {
  const { data, isLoading } = useGetAnnouncements({ page: '1', limit: '3' });

  return (
    <CardContainer className="border-neutral-border-light rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b16-600 text-content-heading">Recent announcement</h4>
        <Link
          href={ROUTES.UPDATES_AND_ANNOUNCEMENTS}
          className="text-b14-600 text-primary flex items-center gap-1 hover:underline"
        >
          View <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.rows?.length ? (
        <EmptyState size="sm" title="No announcements yet" description="New announcements will appear here." />
      ) : (
        <div className="space-y-[22px]">
          {data.rows.map((announcement) => {
            const author = announcement.user ?? announcement.User;
            const createdAt = new Date(announcement.createdAt);
            const date = createdAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
            const time = createdAt.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true });
            return (
              <Link
                key={announcement.id}
                href={ROUTES.VIEW_ANNOUNCEMENT(announcement.id)}
                className="flex gap-4 rounded-lg -m-2.5 p-2.5 hover:bg-gray-50 transition-colors group"
              >
                {announcement.photoURL ? (
                  <img
                    src={announcement.photoURL}
                    alt={announcement.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="bg-primary/10 rounded-lg flex items-center justify-center shrink-0 w-12 h-12">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-b14-600 text-neutral-black truncate group-hover:text-primary transition-colors">
                    {announcement.title}
                  </p>
                  <p className="text-c1 text-neutral-light-grey mt-0.5">
                    {author ? `by ${author.firstName} ${author.lastName} • ` : ''}
                    {date} at {time}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </CardContainer>
  );
};

export default AnnouncementsSection;
