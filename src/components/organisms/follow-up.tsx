'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarIcon, Clock, Pencil, Trash2, X } from 'lucide-react';
import CardContainer from '@/components/atoms/card-container';
import { CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';
import DatePicker from '@/components/atoms/date-picker';
import { useAddFollowUp, useDeleteFollowUp, useUpdateFollowUp } from '@/mutations/leads/follow-up';
import { useGetFollowUp } from '@/query/get-leads';
import DeleteDialog from '@/components/organisms/delete.dialog';

type FollowUp = {
  id: number;
  date: string; // ISO date string "2025-08-22"
  time: string; // "16:23"
  title: string;
  description: string;
  status: 'Upcoming' | 'Completed' | 'Missed';
};

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
  const [upcoming, setUpcoming] = React.useState<FollowUp[]>([]);
  const [previous, setPrevious] = React.useState<FollowUp[]>([]);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<{ id: number | null; date: Date | null; time: string; note: string }>({
    id: null,
    date: null,
    time: '',
    note: '',
  });

  React.useEffect(() => {
    if (!followUp) {
      setUpcoming([]);
      setPrevious([]);
      return;
    }

    const now = new Date();
    now.setSeconds(0, 0);

    const parseTime = (timeStr?: string): { hours: number; minutes: number } => {
      if (!timeStr) return { hours: 0, minutes: 0 };
      const ampmMatch = timeStr.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)$/i);
      if (ampmMatch) {
        let hours = parseInt(ampmMatch[1], 10);
        const minutes = parseInt(ampmMatch[2] ?? '0', 10);
        const isPM = ampmMatch[3].toUpperCase() === 'PM';
        if (hours === 12) hours = 0;
        if (isPM) hours += 12;
        return { hours, minutes };
      }
      const hm = timeStr.split(':');
      const hours = parseInt(hm[0] ?? '0', 10);
      const minutes = parseInt(hm[1] ?? '0', 10);
      return { hours, minutes };
    };

    const upcomingList: FollowUp[] = [];
    const previousList: FollowUp[] = [];

    (followUp as unknown as Array<any>).forEach((fu, index) => {
      const datePart = fu?.date as string | undefined;
      if (!datePart) return;
      const baseDate = new Date(datePart);
      if (isNaN(baseDate.getTime())) return;
      const { hours, minutes } = parseTime(fu?.time as string | undefined);
      const event = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes, 0, 0);

      const isUpcoming = event.getTime() >= now.getTime();

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addFollowUp.mutateAsync({
      date: formData?.date ? formData.date?.toString() : '',
      time: formData.time,
      note: formData.note || null,
      followableId: Number(id),
      followableType: followableType,
    });
    // Reset form
    setFormData({
      date: null,
      time: '',
      note: '',
      remindMe: false,
      remindClient: false,
    });

    setEditDialogOpen(false);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      date: null,
      time: '',
      note: '',
      remindMe: false,
      remindClient: false,
    });
  };

  const openEdit = (f: FollowUp) => {
    setEditData({
      id: f.id,
      date: f.date ? new Date(f.date) : null,
      time: f.time || '',
      note: f.title === 'Follow-up' ? '' : f.title,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.id) return;
    updateFollowUp.mutateAsync({
      id: editData.id,
      date: editData.date ? editData.date.toString() : '',
      time: editData.time,
      note: editData.note || null,
      followableId: Number(id),
      followableType: followableType,
    });
    setEditDialogOpen(false);
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
          <Dialog>
            <DialogTrigger asChild>
              <span className="text-b3-b text-primary-blue cursor-pointer">Add follow-up</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <DialogTitle className="text-lg font-semibold">Schedule follow-up</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Follow-up date</Label>
                  <div className="relative">
                    <DatePicker
                      mode="single"
                      selected={formData.date ?? undefined}
                      onSelect={(date) => {
                        console.log(date);

                        setFormData({
                          ...formData,
                          date: date ?? null,
                        });
                      }}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger>
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
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Type something..."
                    className="min-h-[100px] resize-none"
                  />
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
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <CardContent className="divide-y">
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
          <Button variant="outline" size="sm">
            Date range
          </Button>
        </div>
        <CardContent className="divide-y">
          {previous.map((f) => (
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Edit follow-up</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Follow-up date</Label>
              <div className="relative">
                <DatePicker
                  mode="single"
                  selected={editData.date ?? undefined}
                  onSelect={(date) => setEditData((s) => ({ ...s, date: date ?? null }))}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Select value={editData.time} onValueChange={(value) => setEditData((s) => ({ ...s, time: value }))}>
                <SelectTrigger>
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
              <Label htmlFor="edit-note">Note</Label>
              <Textarea
                id="edit-note"
                value={editData.note}
                onChange={(e) => setEditData((s) => ({ ...s, note: e.target.value }))}
                placeholder="Type something..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
