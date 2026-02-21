'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { IAppointment } from '@/types/response-types/appointment-response';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
import Button from '@/components/atoms/button';
import { Cross, Pencil, Trash2, X } from 'lucide-react';
import { useDeleteAppointment } from '@/mutations/appointments/delete-appointment';
import { cn } from '@/lib/utils';
import { CloseCircle } from 'iconsax-reactjs';

interface AppointmentPreviewProps {
  appointment: IAppointment;
  onEdit: (appointment: IAppointment) => void;
  onDelete: () => void;
  onClose: () => void;
}

const AppointmentPreview: React.FC<AppointmentPreviewProps> = ({
  appointment,
  onEdit,
  onDelete,
  onClose,
}) => {
  const { mutateAsync: deleteAppointment } = useDeleteAppointment();

  const handleDelete = async () => {
    await deleteAppointment(appointment.id);
    onDelete();
  };

  const startTime = format(parseISO(appointment.startTime), 'h:mm a');
  const endTime = format(parseISO(appointment.endTime), 'h:mm a');
  const date = format(parseISO(appointment.date), 'EEEE, d MMM, yyyy');
  const duration = Math.round(
    (parseISO(appointment.endTime).getTime() - parseISO(appointment.startTime).getTime()) / 60000,
  );

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(parseISO(dateTimeStr), 'd MMM, yyyy • h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <div className="">

      <div className='flex w-full justify-between border-b pb-4'>
        <div>
          <h4 className='text-neutral-black font-bold text-[18px] mb-1'>{appointment.title} {appointment?.type ? `- ${appointment.type}` : ''}</h4>
          <div className='text-neutral-dark-grey text-body-12'>{date}</div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>


      <div className='py-[10px]'>
        {/* Time */}
        <div className='flex'>
          <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Time</h4>
          <p className="text-sm text-gray-900">
            {startTime} - {endTime} • {duration} mins
          </p>
        </div>

        {/* Description */}
        {appointment.description && (
          <div className='flex'>
            <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Description</h4>
            <p className="text-sm text-gray-900">{appointment.description}</p>
          </div>
        )}

        {/* Client */}
        {appointment.client && (
          <div className='flex'>
            <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Client</h4>
            <p className="text-sm text-gray-900">
              {appointment.client.firstName} {appointment.client.lastName} • {appointment.client.email} •{' '}
              {appointment.client.phone}
            </p>
          </div>
        )}

        {/* Owner */}
        {appointment.user && (
          <div className='flex'>
            <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Owner</h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                {getInitials(appointment.user.firstName, appointment.user.lastName)}
              </div>
              <p className="text-sm text-gray-900">
                {getInitials(appointment.user.firstName, appointment.user.lastName)}{' '}
                {appointment.user.firstName} {appointment.user.lastName}
              </p>
            </div>
          </div>
        )}

        {/* Created By */}
        {appointment.createdByUser && appointment.createdAt && (
          <div className='flex'>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 w-[84px] mr-3">Created by</h4>
            <p className="text-sm text-gray-900">
              {appointment.createdByUser.firstName} {appointment.createdByUser.lastName} {formatDateTime(appointment.createdAt)}
            </p>
          </div>
        )}

        {/* Updated By */}
        {appointment.updatedByUser && appointment.updatedAt && (
          <div className='flex'>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 w-[84px] mr-3">Updated by</h4>
            <p className="text-sm text-gray-900">
              {appointment.updatedByUser.firstName} {appointment.updatedByUser.lastName} {formatDateTime(appointment.updatedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPreview;
