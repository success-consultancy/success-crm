'use client';

import React from 'react';
import CardContainer from '@/components/atoms/card-container';
import { useGetAnnouncements } from '@/query/get-announcements';
import { Megaphone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

const AnnouncementsSection = () => {
  const { data, isLoading } = useGetAnnouncements({ page: '1', limit: '3' });

  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-b14-600 text-content-heading">Recent announcement</h4>
        <Link
          href={ROUTES.UPDATES_AND_ANNOUNCEMENTS}
          className="text-c1 text-primary flex items-center gap-1 hover:underline"
        >
          View <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="h-12 w-12 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.rows?.length ? (
        <p className="text-sm text-content-subtitle py-4 text-center">No announcements yet</p>
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
                  <p className="text-b14-500 text-content-heading truncate group-hover:text-primary transition-colors">
                    {announcement.title}
                  </p>
                  <p className="text-c1 text-content-subtitle mt-0.5">
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
