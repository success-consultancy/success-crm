'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { useForm, Controller, Control, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import FileUploader from '@/components/organisms/file-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAddLeave } from '@/mutations/leave/add-leave';
import { useGetLeaveApprovers } from '@/query/get-leave-approvers';
import { LOADING_LABEL } from '@/constants/messages';
import {
  leaveRequestSchema,
  LeaveRequestSchemaType,
  LEAVE_TYPES,
  FULL_DAY_HOURS,
  isSingleDayLeave,
} from '@/schema/leave-schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: Partial<LeaveRequestSchemaType> = {
  type: '',
  approverId: undefined,
  hoursPerDay: FULL_DAY_HOURS,
  note: '',
  attachmentURL: '',
};

const LeaveRequestDialog = ({ open, onOpenChange }: Props) => {
  const addLeave = useAddLeave();
  const { approvers, isLoading: approversLoading } = useGetLeaveApprovers();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LeaveRequestSchemaType>({
    // zodResolver is satisfied with a partial defaults shape; cast to silence the strict types.
    resolver: zodResolver(leaveRequestSchema) as any,
    defaultValues: DEFAULT_VALUES as any,
  });

  useEffect(() => {
    if (!open) reset(DEFAULT_VALUES as any);
  }, [open, reset]);

  const [startDate, endDate] = useWatch({ control, name: ['startDate', 'endDate'] });
  // Hours per day is only meaningful for a one-day request; multi-day leave is
  // always booked as full days, so the field is hidden and reset rather than
  // left showing a stale part-day figure.
  const showHoursPerDay = isSingleDayLeave(startDate, endDate);

  useEffect(() => {
    if (!showHoursPerDay) setValue('hoursPerDay', FULL_DAY_HOURS, { shouldValidate: false });
  }, [showHoursPerDay, setValue]);

  const noApprovers = !approversLoading && approvers.length === 0;

  const onSubmit = async (values: LeaveRequestSchemaType) => {
    try {
      await addLeave.mutateAsync(values);
      onOpenChange(false);
    } catch {
      // mutation surfaces toast on error; keep dialog open
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0" showCloseButton>
        <DialogHeader className="px-6 py-4 border-b border-neutral-border-light">
          <DialogTitle className="text-h4 font-bold text-neutral-black">Leave request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex flex-col gap-4 px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="leave-type" className="text-b14-600 text-neutral-black">
                Leave type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="leave-type"
                      className="w-full h-11 px-3 text-b16 text-neutral-black border-neutral-border data-[placeholder]:text-neutral-light-grey"
                    >
                      <SelectValue placeholder="Select a leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-b14 text-red-600">{errors.type.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="leave-approver" className="text-b14-600 text-neutral-black">
                Request to
              </Label>
              <Controller
                control={control}
                name="approverId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={approversLoading || noApprovers}
                  >
                    <SelectTrigger
                      id="leave-approver"
                      className="w-full h-11 px-3 text-b16 text-neutral-black border-neutral-border data-[placeholder]:text-neutral-light-grey"
                    >
                      <SelectValue placeholder={approversLoading ? 'Loading managers…' : 'Select a manager'} />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers.map((approver) => (
                        <SelectItem key={approver.id} value={String(approver.id)}>
                          <span className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={approver.profileUrl ?? ''} alt={approver.name} />
                              <AvatarFallback className="bg-accent-100 text-neutral-dark-grey text-c1 font-semibold">
                                {initialsOf(approver.name)}
                              </AvatarFallback>
                            </Avatar>
                            {approver.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {noApprovers ? (
                <p className="flex items-start gap-1.5 text-b14 text-neutral-light-grey">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  No manager is assigned to your branch yet, so there is nobody to send this to. Ask an administrator to
                  assign one.
                </p>
              ) : (
                <p className="text-b14 text-neutral-light-grey">
                  Only this manager is notified and can approve or reject the request.
                </p>
              )}
              {errors.approverId && <p className="text-b14 text-red-600">{errors.approverId.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateField
                label="Start date"
                error={errors.startDate?.message as string | undefined}
                control={control}
                name="startDate"
              />
              <DateField
                label="End date"
                error={errors.endDate?.message as string | undefined}
                control={control}
                name="endDate"
              />
            </div>

            {showHoursPerDay && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="hours-per-day" className="text-b14-600 text-neutral-black">
                  Hours
                </Label>
                <Input
                  id="hours-per-day"
                  type="number"
                  step="0.5"
                  min={0.5}
                  max={24}
                  className="h-11 px-3 text-b16 text-neutral-black border-neutral-border"
                  {...register('hoursPerDay', { valueAsNumber: true })}
                />
                <p className="text-b14 text-neutral-light-grey">
                  Defaults to a full day ({FULL_DAY_HOURS}h). Lower it to book a part day.
                </p>
                {errors.hoursPerDay && <p className="text-b14 text-red-600">{errors.hoursPerDay.message}</p>}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="leave-reason" className="text-b14-600 text-neutral-black">
                Reason
              </Label>
              <Textarea
                id="leave-reason"
                placeholder="Any details about the leave request..."
                className="min-h-[88px] resize-y px-3 py-2 text-b16 text-neutral-black border-neutral-border placeholder:text-neutral-light-grey"
                {...register('note')}
              />
              {errors.note && <p className="text-b14 text-red-600">{errors.note.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Label className="text-b14-600 text-neutral-black">Documents</Label>
                <span className="text-b14 text-neutral-light-grey">(optional)</span>
              </div>
              <FileUploader
                type="leave"
                maxFileSize={20}
                acceptedFiles={[
                  'application/pdf',
                  'image/jpeg',
                  'image/png',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ]}
                onUploadComplete={(files) => {
                  const last = files[files.length - 1];
                  setValue('attachmentURL', last?.url ?? '', { shouldValidate: false });
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-border-light">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={addLeave.isPending}
              className="h-10 px-4 text-b14-600 text-neutral-black border-neutral-border transition-all duration-150 active:bg-accent-100 motion-safe:active:scale-95"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={noApprovers}
              loading={addLeave.isPending}
              loadingText={LOADING_LABEL.send}
              className="h-10 px-4 text-b14-600 text-white transition-all duration-150 active:bg-primary/80 motion-safe:active:scale-95"
            >
              Send request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

interface DateFieldProps {
  label: string;
  error?: string;
  control: Control<LeaveRequestSchemaType>;
  name: 'startDate' | 'endDate';
}

const DateField = ({ label, error, control, name }: DateFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-b14-600 text-neutral-black">{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'h-11 w-full px-3 flex items-center justify-between rounded-md border border-neutral-border bg-white text-left',
                  'text-b16 text-neutral-black cursor-pointer transition-all duration-150',
                  'hover:border-primary hover:bg-accent-50',
                  'active:bg-accent-100',
                  'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40',
                  'data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/40',
                  !field.value && 'text-neutral-light-grey',
                )}
              >
                <span>{field.value ? format(field.value as Date, 'MM/dd/yyyy') : 'mm/dd/yyyy'}</span>
                <CalendarIcon className="h-4 w-4 text-neutral-light-grey" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value as Date | undefined}
                onSelect={(date) => field.onChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <p className="text-b14 text-red-600">{error}</p>}
    </div>
  );
};

export default LeaveRequestDialog;
