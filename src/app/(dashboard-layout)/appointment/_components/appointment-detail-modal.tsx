'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { IAppointment } from '@/types/response-types/appointment-response';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
import Button from '@/components/atoms/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeleteAppointment } from '@/mutations/appointments/delete-appointment';
import { cn } from '@/lib/utils';

interface AppointmentDetailModalProps {
  appointment: IAppointment;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (appointment: IAppointment) => void;
  onDelete: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
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
    <DialogWrapper isOpen={isOpen} setIsOpen={onClose} title={appointment.title} className="max-w-2xl">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Date */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Date</h4>
          <p className="text-sm text-gray-900">{date}</p>
        </div>

        {/* Time */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Time</h4>
          <p className="text-sm text-gray-900">
            {startTime} - {endTime} • {duration} mins
          </p>
        </div>

        {/* Description */}
        {appointment.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-900">{appointment.description}</p>
          </div>
        )}

        {/* Client */}
        {appointment.client && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Client</h4>
            <p className="text-sm text-gray-900">
              {appointment.client.firstName} {appointment.client.lastName} • {appointment.client.email} •{' '}
              {appointment.client.phone}
            </p>
          </div>
        )}

        {/* Owner */}
        {appointment.owner && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Owner</h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                {getInitials(appointment.owner.firstName, appointment.owner.lastName)}
              </div>
              <p className="text-sm text-gray-900">
                {getInitials(appointment.owner.firstName, appointment.owner.lastName)}{' '}
                {appointment.owner.firstName} {appointment.owner.lastName}
              </p>
            </div>
          </div>
        )}

        {/* Created By */}
        {appointment.createdBy && appointment.createdAt && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Created by</h4>
            <p className="text-sm text-gray-900">
              {appointment.createdBy.firstName} {appointment.createdBy.lastName} {formatDateTime(appointment.createdAt)}
            </p>
          </div>
        )}

        {/* Updated By */}
        {appointment.updatedBy && appointment.updatedAt && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Updated by</h4>
            <p className="text-sm text-gray-900">
              {appointment.updatedBy.firstName} {appointment.updatedBy.lastName} {formatDateTime(appointment.updatedAt)}
            </p>
          </div>
        )}
      </div>
    </DialogWrapper>
  );
};

export default AppointmentDetailModal;
