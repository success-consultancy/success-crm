'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { IAppointment } from '@/types/response-types/appointment-response';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
import Button from '@/components/atoms/button';
import { Cross, Pencil, Trash2, X } from 'lucide-react';
import { useDeleteAppointment } from '@/mutations/appointments/delete-appointment';
import { cn } from '@/lib/utils';
import { CloseCircle } from 'iconsax-reactjs';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';

interface AppointmentPreviewProps {
  appointment: IAppointment;
  onEdit: (appointment: IAppointment) => void;
  onDelete: () => void;
  onClose: () => void;
  disableHeader?: boolean;
}

const AppointmentPreview: React.FC<AppointmentPreviewProps> = ({
  appointment,
  onEdit,
  onDelete,
  onClose,
  disableHeader = false,
}) => {
  const { mutateAsync: deleteAppointment } = useDeleteAppointment();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAppointment(appointment.id);
      setIsDeleteDialogOpen(false);
      onDelete();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
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
    <div>
      {!disableHeader && (
        <>
          <div className='flex w-full justify-between py-4'>
            <div className='flex'>
              <span className={cn('h-[10px] w-[10px] rounded-full mt-2', getAppointColorBasedOnUserName(appointment?.user?.firstName || '', appointment?.user?.lastName || ''))}></span>
              <div className='ml-3'>
                <h4 className='text-neutral-black font-bold text-[18px] mb-1'>{appointment.title} {appointment?.type ? `- ${appointment.type}` : ''}</h4>
                <div className='text-neutral-dark-grey text-b12'>{date}</div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className='border-b mb-4 -mx-4 md:-mx-6'></div>
        </>
      )}

      <div className='pt-[10px] flex flex-col gap-[6px]'>
        {/* Time */}
        <div className='flex'>
          <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Time: </h4>
          <p className="text-sm text-gray-900">
            {startTime} - {endTime} • {duration} mins
          </p>
        </div>

        {/* Description */}
        {appointment.description && (
          <div className='flex'>
            <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Description: </h4>
            <p className="text-sm text-gray-900">{appointment.description}</p>
          </div>
        )}

        {/* Client */}
        {appointment.lead && (
          <div className='flex'>
            <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Client: </h4>
            <p className="text-sm text-gray-900">
              {appointment.lead.firstName} {appointment.lead.lastName} • {appointment.lead.email} •{' '}
              {appointment.lead.phone}
            </p>
          </div>
        )}

        {/* Owner */}
        {appointment.user && (
          <div className='flex'>
            <h4 className="text-sm font-semibold mb-1 w-[84px] mr-3">Owner: </h4>
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium", getAppointColorBasedOnUserName(appointment.user.firstName, appointment.user.lastName))}>
                {getInitials(appointment.user.firstName, appointment.user.lastName)}
              </div>
              <p className="text-sm">
                {getInitials(appointment.user.firstName, appointment.user.lastName)}{' '}
                {appointment.user.firstName} {appointment.user.lastName}
              </p>
            </div>
          </div>
        )}

        <div className='border-b pb-4 mb-4 -mx-4 md:-mx-6'></div>

        {/* Created By */}
        {appointment.createdByUser && appointment.createdAt && (
          <div className='flex'>
            <h4 className="text-b12-500 mb-1 w-[84px] mr-3 text-neutral-black">Created by: </h4>
            <p className="text-b12 text-neutral-dark-grey">
              {appointment.createdByUser.firstName} {appointment.createdByUser.lastName} • {formatDateTime(appointment.createdAt)}
            </p>
          </div>
        )}

        {/* Updated By */}
        {appointment.updatedByUser && appointment.updatedAt && (
          <div className='flex'>
            <h4 className="text-b12-500 mb-1 w-[84px] mr-3 text-neutral-black">Updated by: </h4>
            <p className="text-b12 text-neutral-dark-grey">
              {appointment.updatedByUser.firstName} {appointment.updatedByUser.lastName} • {formatDateTime(appointment.updatedAt)}
            </p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title="Delete Appointment"
        message={`Are you sure you want to delete "${appointment.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default AppointmentPreview;

