'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Pencil, Trash2 } from 'lucide-react';
import CardContainer from '@/components/atoms/card-container';
import { CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';
import DatePicker from '@/components/atoms/date-picker';
import { useAddFollowUp, useDeleteFollowUp, useUpdateFollowUp } from '@/mutations/leads/follow-up';
import { useGetFollowUp } from '@/query/get-leads';
import DeleteDialog from '@/components/organisms/delete.dialog';
import { EmptyState } from '@/components/common/empty-state';
import { LOADING_LABEL } from '@/constants/messages';

type FollowUp = {
  id: number;
  date: string; // ISO date string "2025-08-22"
  time: string; // "16:23"
  title: string;
  description: string;
  status: 'Upcoming' | 'Completed' | 'Missed';
};

// Format a Date as a local YYYY-MM-DD (avoids the UTC shift that toISOString causes).
const toDateOnly = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const getStatusColor = (status: FollowUp['status']) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'Missed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
interface IFollowUp {
  id: string;
  followableType: string;
}

export default function FollowUp({ id, followableType }: IFollowUp) {
  const addFollowUp = useAddFollowUp();
  const updateFollowUp = useUpdateFollowUp();
  const deleteFollowUp = useDeleteFollowUp(id);
  const { data: followUp } = useGetFollowUp(id, followableType);
  const [formData, setFormData] = React.useState<{
    date: Date | null;
    time: string;
    note: string;
    remindMe: boolean;
    remindClient: boolean;
  }>({
    date: null,
    time: '',
    note: '',
    remindMe: false,
    remindClient: false,
  });
  const [formErrors, setFormErrors] = React.useState<{ date?: string; time?: string; note?: string }>({});
  const [upcoming, setUpcoming] = React.useState<FollowUp[]>([]);
  const [previous, setPrevious] = React.useState<FollowUp[]>([]);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<{ id: number | null; date: Date | null; time: string; note: string }>({
    id: null,
    date: null,
    time: '',
    note: '',
  });
  const [editErrors, setEditErrors] = React.useState<{ note?: string }>({});
  const [dateRange, setDateRange] = React.useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [rangeOpen, setRangeOpen] = React.useState(false);

  // Start of today — used to disable past dates when scheduling a follow-up.
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Filter the Previous list to the selected date range (inclusive). Either
  // bound is optional — an open-ended range filters on just the set side.
  const filteredPrevious = React.useMemo(() => {
    const { from, to } = dateRange;
    if (!from && !to) return previous;
    const fromTs = from ? new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime() : -Infinity;
    const toTs = to ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999).getTime() : Infinity;
    return previous.filter((f) => {
      const t = new Date(f.date).getTime();
      return t >= fromTs && t <= toTs;
    });
  }, [previous, dateRange]);

  React.useEffect(() => {
    if (!followUp) {
      setUpcoming([]);
      setPrevious([]);
      return;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcomingList: FollowUp[] = [];
    const previousList: FollowUp[] = [];

    (followUp as unknown as Array<any>).forEach((fu, index) => {
      const datePart = fu?.date as string | undefined;
      if (!datePart) return;
      const baseDate = new Date(datePart);
      if (isNaN(baseDate.getTime())) return;

      // Status is date-based: once the follow-up date arrives (today or earlier)
      // the reminder has already fired, so it belongs in Previous/Completed.
      const eventDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      const isUpcoming = eventDate.getTime() > todayStart.getTime();

      const item: FollowUp = {
        id: fu?.id ?? index,
        date: baseDate.toISOString(),
        time: fu?.time ?? '',
        title: fu?.note ?? 'Follow-up',
        description: `${baseDate.toDateString()}${fu?.time ? `, ${fu.time}` : ''}`,
        status: isUpcoming ? 'Upcoming' : 'Completed',
      };

      if (isUpcoming) upcomingList.push(item);
      else previousList.push(item);
    });

    const byEventAsc = (a: FollowUp, b: FollowUp) => new Date(a.date).getTime() - new Date(b.date).getTime();
    const byEventDesc = (a: FollowUp, b: FollowUp) => new Date(b.date).getTime() - new Date(a.date).getTime();

    setUpcoming(upcomingList.sort(byEventAsc));
    setPrevious(previousList.sort(byEventDesc));
  }, [followUp]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate follow-ups from rapid double-clicks (CRM-184).
    if (addFollowUp.isPending) return;

    // Validate required fields and show inline messages
    const errors: { date?: string; time?: string; note?: string } = {};
    if (!formData.date) errors.date = 'Follow-up date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.note.trim()) errors.note = 'Note is required';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await addFollowUp.mutateAsync({
        date: toDateOnly(formData.date!),
        time: formData.time,
        note: formData.note.trim(),
        remindMe: formData.remindMe,
        remindClient: formData.remindClient,
        followableId: Number(id),
        followableType: followableType,
      });
      setFormData({
        date: null,
        time: '',
        note: '',
        remindMe: false,
        remindClient: false,
      });
      setFormErrors({});
      setAddDialogOpen(false);
    } catch {
      // mutation's onError surfaces a toast; keep the dialog open so the user can retry
    }
  };

  const handleCancel = () => {
    // Reset form and close the add dialog.
    setFormData({
      date: null,
      time: '',
      note: '',
      remindMe: false,
      remindClient: false,
    });
    setFormErrors({});
    setAddDialogOpen(false);
  };

  const openEdit = (f: FollowUp) => {
    setEditData({
      id: f.id,
      date: f.date ? new Date(f.date) : null,
      time: f.time || '',
      note: f.title === 'Follow-up' ? '' : f.title,
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.id || updateFollowUp.isPending) return;
    if (!editData.note.trim()) {
      setEditErrors({ note: 'Note is required' });
      return;
    }
    updateFollowUp.mutateAsync({
      id: editData.id,
      date: editData.date ? editData.date.toString() : '',
      time: editData.time,
      note: editData.note.trim(),
      followableId: Number(id),
      followableType: followableType,
    });
    setEditDialogOpen(false);
    setEditErrors({});
    setEditData({ id: null, date: null, time: '', note: '' });
  };

  const timeOptions = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
  ];
  return (
    <div className="space-y-6">
      {/* Upcoming */}
      <CardContainer>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">Upcoming</h2>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <span className="text-b3-b text-primary-blue cursor-pointer">Add follow-up</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <DialogTitle className="text-lg font-semibold">Schedule follow-up</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Follow-up date</Label>
                  <DatePicker
                    mode="single"
                    placeholder="Select follow-up date"
                    selected={formData.date ?? undefined}
                    disabled={{ before: today }}
                    onSelect={(date) => {
                      setFormData({ ...formData, date: date ?? null });
                      if (date) setFormErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                  />
                  {formErrors.date && <p className="text-sm text-red-500">{formErrors.date}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => {
                      setFormData({ ...formData, time: value });
                      setFormErrors((prev) => ({ ...prev, time: undefined }));
                    }}
                  >
                    <SelectTrigger className="w-full border-neutral-border data-[size=default]:h-10">
                      <SelectValue placeholder="Select follow-up time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.time && <p className="text-sm text-red-500">{formErrors.time}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => {
                      setFormData({ ...formData, note: e.target.value });
                      if (e.target.value.trim()) setFormErrors((prev) => ({ ...prev, note: undefined }));
                    }}
                    placeholder="Type something.."
                    className="min-h-[120px] resize-none border-neutral-border"
                  />
                  {formErrors.note && <p className="text-sm text-red-500">{formErrors.note}</p>}
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remind-me"
                      checked={formData.remindMe}
                      onCheckedChange={(checked) => setFormData({ ...formData, remindMe: checked as boolean })}
                    />
                    <Label htmlFor="remind-me" className="text-sm font-normal">
                      Remind me
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remind-client"
                      checked={formData.remindClient}
                      onCheckedChange={(checked) => setFormData({ ...formData, remindClient: checked as boolean })}
                    />
                    <Label htmlFor="remind-client" className="text-sm font-normal">
                      Remind client
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-neutral-border"
                    onClick={handleCancel}
                    disabled={addFollowUp.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={addFollowUp.isPending} loadingText={LOADING_LABEL.save}>
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <CardContent className="divide-y">
          {upcoming.length === 0 && (
            <EmptyState title="No upcoming follow-ups" description="Scheduled follow-ups will appear here." />
          )}
          {upcoming.map((f) => (
            <div key={f.id} className="flex items-start justify-between py-4">
              {/* Date Badge */}
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-gray-100 text-center">
                  <span className="text-sm font-medium">
                    {new Date(f.date).toLocaleString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{new Date(f.date).getDate()}</span>
                </div>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {f.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(f.status)}>{f.status}</Badge>
                <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                  <Pencil size={16} />
                </Button>
                <DeleteDialog
                  title="Delete follow-up?"
                  description="This action cannot be undone."
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Trash2 size={16} />
                    </Button>
                  }
                  confirmText="Delete"
                  onConfirm={() => deleteFollowUp.mutate({ id: f.id })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </CardContainer>

      {/* Previous */}
      <CardContainer>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">Previous</h2>
          <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                {dateRange.from || dateRange.to
                  ? `${dateRange.from ? dateRange.from.toLocaleDateString() : '…'} – ${
                      dateRange.to ? dateRange.to.toLocaleDateString() : '…'
                    }`
                  : 'Date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto space-y-4 p-4">
              <div className="space-y-2">
                <Label>From</Label>
                <DatePicker
                  mode="single"
                  selected={dateRange.from ?? undefined}
                  onSelect={(date) => setDateRange((r) => ({ ...r, from: date ?? null }))}
                />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <DatePicker
                  mode="single"
                  selected={dateRange.to ?? undefined}
                  onSelect={(date) => setDateRange((r) => ({ ...r, to: date ?? null }))}
                />
              </div>
              <div className="flex justify-between pt-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => setDateRange({ from: null, to: null })}>
                  Clear
                </Button>
                <Button type="button" size="sm" onClick={() => setRangeOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardContent className="divide-y">
          {filteredPrevious.length === 0 && (
            <EmptyState title="No past follow-ups" description="No follow-ups in this range." />
          )}
          {filteredPrevious.map((f) => (
            <div key={f.id} className="flex items-start justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-gray-100">
                  <span className="text-sm font-medium">
                    {new Date(f.date).toLocaleString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{new Date(f.date).getDate()}</span>
                </div>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {f.description}
                  </p>
                </div>
              </div>

              {/* Completed follow-ups are read-only — no edit/delete. */}
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(f.status)}>{f.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </CardContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Edit follow-up</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">Follow-up date</Label>
              <DatePicker
                mode="single"
                placeholder="Select follow-up date"
                selected={editData.date ?? undefined}
                onSelect={(date) => setEditData((s) => ({ ...s, date: date ?? null }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-time">Time</Label>
              <Select value={editData.time} onValueChange={(value) => setEditData((s) => ({ ...s, time: value }))}>
                <SelectTrigger className="w-full border-neutral-border data-[size=default]:h-10">
                  <SelectValue placeholder="Select follow-up time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note">
                Note <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-note"
                value={editData.note}
                onChange={(e) => {
                  setEditData((s) => ({ ...s, note: e.target.value }));
                  if (e.target.value.trim()) setEditErrors((prev) => ({ ...prev, note: undefined }));
                }}
                placeholder="Type something.."
                className="min-h-[120px] resize-none border-neutral-border"
              />
              {editErrors.note && <p className="text-sm text-red-500">{editErrors.note}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-neutral-border"
                onClick={() => setEditDialogOpen(false)}
                disabled={updateFollowUp.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={updateFollowUp.isPending} loadingText={LOADING_LABEL.update}>
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
