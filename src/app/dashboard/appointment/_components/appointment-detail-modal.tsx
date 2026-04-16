'use client';

import React from 'react';
import { IAppointment } from '@/types/response-types/appointment-response';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
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
      showHeader={false}
    >
      <AppointmentPreview appointment={appointment} onEdit={onEdit} onDelete={onDelete} onClose={onClose} />
    </DialogWrapper>
  );
};

export default AppointmentDetailModal;
