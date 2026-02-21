'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { AppointmentSchemaType, appointmentFormSchema } from '@/schema/appointment-schema';
import { IAppointment } from '@/types/response-types/appointment-response';
import DialogWrapper from '@/components/organisms/dialog-wrapper';
import Button from '@/components/atoms/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Input from '@/components/molecules/input';
import { Textarea } from '@/components/ui/textarea';
import SelectField from '@/components/organisms/select-field';
import { DatePicker } from '@/components/organisms/date-picker';
import { useAddAppointment } from '@/mutations/appointments/add-appointment';
import { useEditAppointment } from '@/mutations/appointments/edit-appointment';
import { useGetMe } from '@/query/get-me';
import { trim } from 'lodash';
import LeadSelectWithCommand from '@/components/molecules/lead-select-with-command';
import UserSelectWithCommand from '@/components/molecules/user-select-with-command';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: IAppointment | null;
  selectedDate?: Date;
}

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  isOpen,
  onClose,
  appointment,
  selectedDate,
}) => {
  const { data: currentUser } = useGetMe();
  const { mutateAsync: addAppointment } = useAddAppointment();
  const { mutateAsync: editAppointment } = useEditAppointment();

  const isEditMode = !!appointment;

  const form = useForm<AppointmentSchemaType>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      ownerId: currentUser?.data?.id || 0,
      type: 'in-person',
      status: 'scheduled',
    },
  });

  useEffect(() => {
    if (appointment) {
      const appointmentDate = format(parseISO(appointment.date), 'yyyy-MM-dd');
      const startTime = format(parseISO(appointment.startTime), 'HH:mm');
      const endTime = format(parseISO(appointment.endTime), 'HH:mm');

      form.reset({
        title: appointment.title,
        description: appointment.description || '',
        date: appointmentDate,
        startTime: startTime,
        endTime: endTime,
        clientId: appointment.clientId || undefined,
        ownerId: appointment.ownerId,
        type: appointment.type || 'in-person',
        status: appointment.status || 'scheduled',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '09:30',
        ownerId: currentUser?.data?.id || 0,
        type: 'in-person',
        status: 'scheduled',
      });
    }
  }, [appointment, selectedDate, currentUser, form]);

  const onSubmit = async (data: AppointmentSchemaType) => {
    try {
      // Format times to ISO format
      const dateStr = data.date;
      const startDateTime = `${dateStr}T${data.startTime}:00`;
      const endDateTime = `${dateStr}T${data.endTime}:00`;

      const payload = {
        title: data.title,
        description: data.description || undefined,
        date: dateStr,
        startTime: startDateTime,
        endTime: endDateTime,
        clientId: data.clientId || undefined,
        ownerId: data.ownerId,
      };

      if (isEditMode && appointment) {
        await editAppointment({
          ...payload,
          id: appointment.id,
        });
      } else {
        await addAppointment(payload);
      }

      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const typeOptions = [
    { label: 'In Person', value: 'in-person' },
    { label: 'Online', value: 'online' },
    { label: 'Phone', value: 'phone' },
  ];

  return (
    <DialogWrapper
      isOpen={isOpen}
      setIsOpen={onClose}
      title={isEditMode ? 'Edit appointment' : 'Create new appointment'}
      className="max-w-2xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g, Online appointment for visa service" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                const dateValue = field.value ? (typeof field.value === 'string' ? parseISO(field.value) : field.value) : selectedDate || new Date();
                return (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={dateValue instanceof Date ? dateValue : undefined}
                        onChange={(date) => {
                          if (date) {
                            field.onChange(format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        label=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UserSelectWithCommand
                      value={field.value?.toString()}
                      label="Owner"
                      placeholder="Search by name, email or phone"
                      onSelect={(val) => {
                        if (!val) {
                          return;
                        }

                        field.onChange(Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LeadSelectWithCommand
                    value={field.value?.toString()}
                    label="Client"
                    placeholder="Search by name, email or phone"
                    onSelect={(val) => {
                      if (!val) {
                        return;
                      }

                      field.onChange(Number(val));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="Type something about appointment..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={form.formState.isSubmitting}>
              {isEditMode ? 'Update' : 'Create'} Appointment
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper >
  );
};

export default AppointmentFormModal;
