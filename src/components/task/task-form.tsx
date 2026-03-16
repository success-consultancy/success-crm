'use client';

import { useState } from 'react';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { Calendar, Clock, UserPlus, X, CalendarDays } from 'lucide-react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IUser } from '@/types/leads/leads-types';

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 7; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) break;
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const min = m === 0 ? '00' : '30';
      slots.push(`${hour}:${min} ${ampm}`);
    }
  }
  return slots;
})();

/** Tooltip that works nested inside a Popover trigger (both merge onto the button) */
function IconTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        {children}
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={6}
            className="z-[9999] rounded bg-gray-900 px-2.5 py-1 text-xs text-white shadow-md select-none"
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

const iconBtnBase =
  'w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-400';
const iconBtnDefault = 'border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-600';
const iconBtnActive = 'bg-blue-50 border-blue-400 text-blue-500';

interface TaskFormProps {
  form: any;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode: boolean;
  superAdmin: boolean;
  users?: IUser[];
}

const TaskForm = ({ form, onSubmit, onCancel, isEditMode, superAdmin, users }: TaskFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const dueDate: Date | undefined = form.watch('dueDate');
  const dueTime: string | undefined = form.watch('dueTime');
  const assignedUserId: number | undefined = form.watch('userId');

  const isToday = dueDate ? isSameDay(dueDate, today) : false;
  const isTomorrow = dueDate ? isSameDay(dueDate, tomorrow) : false;
  const hasCustomDate = !!dueDate && !isToday && !isTomorrow;

  const formatDate = (date: Date) => {
    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, tomorrow)) return 'Tomorrow';
    return format(date, 'EEE, MMM d, yyyy');
  };

  const selectedUser = users?.find((u) => u.id === assignedUserId);

  const clearDateTime = () => {
    form.setValue('dueDate', undefined);
    form.setValue('dueTime', undefined);
  };

  const filteredUsers = users?.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-white shadow-sm">
      <div className="flex items-start gap-2">
        {/* Circle radio decoration */}
        <div className="mt-[3px] w-[18px] h-[18px] rounded-full border-2 border-gray-300 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <input
            {...form.register('detail')}
            placeholder="Title *"
            autoFocus
            className={cn(
              'w-full text-sm font-medium outline-none placeholder:text-gray-400 bg-transparent',
              form.formState.errors.detail && 'placeholder:text-red-400',
            )}
          />
          {form.formState.errors.detail && (
            <p className="text-xs text-red-500 mt-0.5">{form.formState.errors.detail.message}</p>
          )}

          {/* Description */}
          <input
            {...form.register('description')}
            placeholder="Description"
            className="w-full text-xs text-gray-500 outline-none mt-1 placeholder:text-gray-400 bg-transparent"
          />

          {/* Selected chips */}
          {(dueDate || (!dueDate && dueTime) || selectedUser) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {dueDate && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-700">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{formatDate(dueDate)}</span>
                  {dueTime && (
                    <>
                      <span className="text-gray-400 mx-0.5">|</span>
                      <span>{dueTime}</span>
                    </>
                  )}
                  <button type="button" onClick={clearDateTime} className="ml-0.5 hover:text-gray-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {!dueDate && dueTime && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-700">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>{dueTime}</span>
                  <button
                    type="button"
                    onClick={() => form.setValue('dueTime', undefined)}
                    className="ml-0.5 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedUser && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-md px-2 py-0.5 text-gray-700">
                  <UserPlus className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </span>
                  <button
                    type="button"
                    onClick={() => form.setValue('userId', undefined)}
                    className="ml-0.5 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Action buttons row */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {/* Today */}
            <button
              type="button"
              onClick={() => form.setValue('dueDate', today)}
              className={cn(
                'text-xs px-2 py-0.5 rounded border transition-colors',
                isToday
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50',
              )}
            >
              Today
            </button>

            {/* Tomorrow */}
            <button
              type="button"
              onClick={() => form.setValue('dueDate', tomorrow)}
              className={cn(
                'text-xs px-2 py-0.5 rounded border transition-colors',
                isTomorrow
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50',
              )}
            >
              Tomorrow
            </button>

            {/* ── Set deadline (calendar) ── */}
            <IconTooltip label="Set deadline">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <TooltipPrimitive.Trigger asChild>
                    <button
                      type="button"
                      className={cn(iconBtnBase, hasCustomDate ? iconBtnActive : iconBtnDefault)}
                    >
                      <CalendarDays className="w-[15px] h-[15px]" />
                    </button>
                  </TooltipPrimitive.Trigger>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      form.setValue('dueDate', date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < startOfDay(new Date())}
                    captionLayout="dropdown"
                    startMonth={today}
                    endMonth={new Date(2050, 11, 31)}
                  />
                </PopoverContent>
              </Popover>
            </IconTooltip>

            {/* ── Set time (clock) ── */}
            <IconTooltip label="Set time">
              <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                <PopoverTrigger asChild>
                  <TooltipPrimitive.Trigger asChild>
                    <button
                      type="button"
                      className={cn(iconBtnBase, dueTime ? iconBtnActive : iconBtnDefault)}
                    >
                      <Clock className="w-[15px] h-[15px]" />
                    </button>
                  </TooltipPrimitive.Trigger>
                </PopoverTrigger>
                <PopoverContent className="w-[140px] p-1" align="start" side="bottom">
                  <ScrollArea className="h-48">
                    <div className="flex flex-col">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            form.setValue('dueTime', time);
                            setIsTimeOpen(false);
                          }}
                          className={cn(
                            'w-full text-left text-sm px-3 py-1.5 rounded hover:bg-gray-100',
                            dueTime === time && 'bg-blue-50 text-blue-600',
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </IconTooltip>

            {/* ── Assign task (user, admin only) ── */}
            {superAdmin && (
              <IconTooltip label="Assign task">
                <Popover open={isUserOpen} onOpenChange={setIsUserOpen}>
                  <PopoverTrigger asChild>
                    <TooltipPrimitive.Trigger asChild>
                      <button
                        type="button"
                        className={cn(iconBtnBase, selectedUser ? iconBtnActive : iconBtnDefault)}
                      >
                        <UserPlus className="w-[15px] h-[15px]" />
                      </button>
                    </TooltipPrimitive.Trigger>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-2" align="start" side="bottom">
                    <input
                      placeholder="Search..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full text-sm border rounded-md px-2 py-1.5 mb-2 outline-none focus:border-blue-400"
                    />
                    <div className="max-h-44 overflow-y-auto">
                      {filteredUsers?.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            form.setValue('userId', user.id);
                            setIsUserOpen(false);
                            setUserSearch('');
                          }}
                          className={cn(
                            'w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-100',
                            assignedUserId === user.id && 'bg-blue-50 text-blue-600',
                          )}
                        >
                          {user.firstName} {user.lastName}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </IconTooltip>
            )}
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          <Button type="button" size="sm" onClick={onSubmit} className="h-7 text-xs px-3 rounded-full">
            {isEditMode ? 'Save' : 'Add'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="h-7 text-xs px-2 rounded-full text-gray-500"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
