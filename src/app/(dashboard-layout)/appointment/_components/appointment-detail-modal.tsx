'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { IAppointment } from '@/types/response-types/appointment-response';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
import Button from '@/components/atoms/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeleteAppointment } from '@/mutations/appointments/delete-appointment';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import AppointmentPreview from './appointment-preview';

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
  return (
    <DialogWrapper
      isOpen={isOpen}
      setIsOpen={onClose}
      title={appointment.title}
      className="max-w-2xl"
    >
      <AppointmentPreview appointment={appointment} onEdit={onEdit} onDelete={onDelete} onClose={onClose} disableHeader />
    </DialogWrapper>
  );
};

export default AppointmentDetailModal;
