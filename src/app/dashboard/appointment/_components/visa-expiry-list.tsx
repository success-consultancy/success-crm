'use client';

import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { VisaExpiryEvent, getCategoryColor } from './use-visa-expiries';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';

interface VisaExpiryListProps {
  events: VisaExpiryEvent[];
  onEventClick: (event: VisaExpiryEvent) => void;
  isLoading?: boolean;
}

const VisaExpiryList: React.FC<VisaExpiryListProps> = ({ events, onEventClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 pr-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        size="sm"
        className="flex-1"
        title="No visa expiries today"
        description="Clients with visa expiries on this date will be listed here."
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {events.map((event) => {
        const color = getCategoryColor(event.category);
        return (
          <div
            key={event.id}
            className="cursor-pointer bg-white hover:bg-gray-50 transition-colors border rounded-lg p-3"
            onClick={() => onEventClick(event)}
          >
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
              <div className="flex-1 min-w-0">
                <h5 className="text-b13-500 text-neutral-black mb-1 truncate">
                  {event.firstName}'s Visa Expires ({event.category})
                </h5>
                <div className="flex items-center gap-1.5 text-b12 text-neutral-dark-grey mb-0.5">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-b12 text-neutral-dark-grey">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.phone}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VisaExpiryList;
