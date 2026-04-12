'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { IAppointment } from '@/types/response-types/appointment-response';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import { Skeleton } from '@/components/ui/skeleton';

interface AppointmentListProps {
  appointments: IAppointment[];
  onAppointmentClick: (appointment: IAppointment) => void;
  isLoading?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onAppointmentClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3 pr-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="w-[26px] h-[26px] rounded-full flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No appointments for this date</p>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
      {appointments.map((appointment) => {
        const startTime = format(parseISO(appointment.startTime), 'h:mm a');
        const endTime = format(parseISO(appointment.endTime), 'h:mm a');


        return (
          <div
            key={appointment.id}
            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onAppointmentClick(appointment)}
          >
            <div className="flex items-start gap-3">
              <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', getAppointColorBasedOnUserName(appointment.user?.firstName || '', appointment.user?.lastName || ''))} />
              <div className="flex-1 min-w-0">
                <h5 className="text-b13-500 text-neutral-black mb-1 truncate">{appointment.title}</h5>
                {appointment.description && (
                  <p className="text-neutral-dark-grey text-b12 mb-2 line-clamp-2">{appointment.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-b12-500 border rounded-full px-2 py-1 !mb-0">
                    {startTime} - {endTime}
                  </span>
                  {appointment.user && (
                    <Avatar
                      title={`${appointment.user?.firstName} ${appointment.user?.lastName}`}
                      className={cn("w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-medium text-white", getAppointColorBasedOnUserName(appointment.user?.firstName || '', appointment.user?.lastName || ''))}
                    >
                      {getInitials(appointment.user?.firstName, appointment.user?.lastName)}
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div >
  );
};

export default AppointmentList;
