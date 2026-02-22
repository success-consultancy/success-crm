'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays,
  isSameMonth, isSameDay, startOfDay, parseISO, getHours, getMinutes, differenceInMinutes
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Plus, X } from 'lucide-react';
import useSearchParams from '@/hooks/use-search-params';
import { APPOINTMENT_FILTER_PARAMS, useGetAppointments } from '@/query/get-appointments';
import { CALENDAR_FILTER_PARAMS, useGetCalendar } from '@/query/get-calendar';
import Container from '@/components/atoms/container';
import Portal from '@/components/atoms/portal';
import { PortalIds } from '@/config/portal';
import Button from '@/components/atoms/button';
import { IAppointment } from '@/types/response-types/appointment-response';
import AppointmentList from './appointment-list';
import AppointmentDetailModal from './appointment-detail-modal';
import AppointmentFormModal from './appointment-form-modal';
import TabSelector from '@/components/atoms/tab-selector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppointmentPreview from './appointment-preview';
import { cn } from '@/lib/utils';
import UserSelectWithCommand from '@/components/molecules/user-select-with-command';
import { getAppointColorBasedOnUserName } from '@/utils/color';
import { useCalendarData } from './use-calendar-data';

// ==========================================
// 1. CONSTANTS & UTILITIES (Move to a utils file)
// ==========================================
const VIEW_OPTIONS = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'work-week', label: 'Work week' },
  { key: 'day', label: 'Day' },
  { key: 'agenda', label: 'Agenda' },
];

const TAB_CONFIG = [
  { key: 'appointment', label: 'Appointment' },
  { key: 'calendar', label: 'Calendar' },
];

const HOUR_HEIGHT = 80;

const getAppointmentColor = (type?: string) => {
  switch (type) {
    case 'online': return { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' };
    case 'phone': return { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
    default: return { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
  }
};

const getUserInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

const getAppointmentPosition = (item: IAppointment, dayDate: Date) => {
  const startTime = parseISO(item.startTime);
  const endTime = parseISO(item.endTime);
  if (format(startTime, 'yyyy-MM-dd') !== format(dayDate, 'yyyy-MM-dd')) return null;

  const startMinutes = (getHours(startTime) - 8) * 60 + getMinutes(startTime);
  const totalMinutesInDay = 12 * 60; // 8 AM to 8 PM

  return {
    top: `${Math.max(0, (startMinutes / totalMinutesInDay) * 100)}%`,
    height: `${Math.min(100, (differenceInMinutes(endTime, startTime) / totalMinutesInDay) * 100)}%`,
    startTime,
    endTime,
  };
};

const getTopPosition = (date: Date | string) => {
  const minutesSinceMidnight = differenceInMinutes(new Date(date), startOfDay(new Date(date)));
  return (minutesSinceMidnight / 60) * HOUR_HEIGHT;
};

const getEventHeight = (startTime: Date | string, endTime: Date | string) => {
  const durationMinutes = differenceInMinutes(new Date(endTime), new Date(startTime));
  return (durationMinutes / 60) * HOUR_HEIGHT;
};


const DayView = ({ selectedDate, timeSlots, itemsByDate, setSelectedDate, onAppointmentClick }: any) => {
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateItems = itemsByDate[dateKey] || [];

  // --- NEW OVERLAP LOGIC ---
  const processedItems = useMemo(() => {
    // 1. Sort by start time first
    const sorted = [...selectedDateItems].sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const columns: any[][] = [];

    sorted.forEach(item => {
      let placed = false;
      const itemStart = new Date(item.startTime).getTime();

      // Try to place in an existing column where it doesn't overlap with the last item
      for (let i = 0; i < columns.length; i++) {
        const lastItemInColumn = columns[i][columns[i].length - 1];
        const lastEnd = new Date(lastItemInColumn.endTime).getTime();

        if (itemStart >= lastEnd) {
          columns[i].push(item);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([item]);
      }
    });

    // Map items to include their position metadata
    return sorted.map(item => {
      const colIndex = columns.findIndex(col => col.includes(item));
      const totalCols = columns.length;
      return { ...item, colIndex, totalCols };
    });
  }, [selectedDateItems]);

  const renderCurrentTimeIndicator = () => {
    const now = new Date();
    const currentHour = getHours(now);
    if (currentHour < 8 || currentHour > 20 || !isSameDay(selectedDate, now)) return null;

    const topPercent = (((currentHour - 8) * 60 + getMinutes(now)) / (12 * 60)) * 100;
    return (
      <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: `${topPercent}%` }}>
        <div className="flex items-center">
          <div className="text-xs text-red-600 font-medium px-2 bg-white">{format(now, 'h:mm a')}</div>
          <div className="flex-1 h-0.5 bg-red-500"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* ... Header Grid ... */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: '80px 1fr' }}>
          {/* Time Labels */}
          <div className="bg-white">
            {timeSlots.map((slot: any, idx: number) => (
              <div key={idx} className={`${slot?.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 px-2 text-xs text-gray-500 pt-1`}>
                {slot.label}
              </div>
            ))}
          </div>

          {/* Event Area */}
          <div className="bg-white relative">
            {timeSlots.map((slot: any, idx: number) => (
              <div key={idx} className={`${slot?.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                onClick={() => slot.hour !== null && setSelectedDate(new Date(selectedDate).setHours(slot.hour, 0, 0, 0))}
              />
            ))}
            {renderCurrentTimeIndicator()}

            {/* Pass position metadata to EventBlock */}
            {processedItems.map((item: any) => (
              <EventBlock
                key={item.id}
                item={item}
                dayDate={selectedDate}
                colIndex={item.colIndex}
                totalCols={item.totalCols}
                onClick={() => onAppointmentClick(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Week View ---
const WeekView = ({ weekDays, selectedDate, setSelectedDate, itemsByDate, onAppointmentClick }: any) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white">
      <div className="flex-1 overflow-y-scroll relative flex flex-col">
        <div className="sticky top-0 z-30 grid gap-px bg-gray-200 border-b flex-shrink-0 shadow-sm" style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
          <div className="bg-[#F9FAFB] p-2" />
          {weekDays.map((day: Date) => (
            <div key={day.toString()} className={`bg-[#F9FAFB] p-2 text-center cursor-pointer hover:bg-gray-50 ${isSameDay(day, selectedDate) ? 'bg-blue-50 border-b-2 border-blue-500' : ''}`} onClick={() => setSelectedDate(day)}>
              <div className="text-b12-500 text-neutral-dark-grey font-medium mb-1">{format(day, 'EEE')}</div>
              <span className={`text-lg font-semibold ${isSameDay(day, new Date()) ? 'bg-primary rounded-full p-2 text-white' : ''}`}>
                {format(day, 'd')}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 grid gap-px bg-gray-200" style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
          <div className="bg-white flex flex-col relative">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="relative border-b border-gray-100 flex items-start justify-center text-xs text-gray-500" style={{ height: `${HOUR_HEIGHT}px` }}>
                <span className="relative -top-2.5 bg-white px-1">{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</span>
              </div>
            ))}
            <div className="absolute left-0 right-0 flex justify-center z-20" style={{ top: `${getTopPosition(currentTime)}px`, transform: 'translateY(-50%)' }}>
              <span className="text-[10px] font-bold text-red-500 bg-white px-1">{format(currentTime, 'h:mm a')}</span>
            </div>
          </div>

          {weekDays.map((day: Date) => (
            <div key={day.toString()} className="bg-white relative">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border-b border-gray-100 w-full hover:bg-gray-50 cursor-pointer" style={{ height: `${HOUR_HEIGHT}px` }} />
              ))}
              {isSameDay(day, new Date()) && (
                <div className="absolute left-0 right-0 border-t-2 border-red-500 z-20" style={{ top: `${getTopPosition(currentTime)}px` }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -left-1.5 -top-[5px]" />
                </div>
              )}
              {(itemsByDate[format(day, 'yyyy-MM-dd')] || []).map((item: any) => (
                <div key={item.id} className="absolute rounded-r-md border-l-4 overflow-hidden p-1 text-xs cursor-pointer hover:shadow-md transition-shadow z-10"
                  style={{
                    top: `${getTopPosition(item.startTime)}px`, height: `${getEventHeight(item.startTime, item.endTime)}px`,
                    left: '4px', right: '4px', borderColor: getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '', 'raw') as string, backgroundColor: '#f0f9ff',
                  }} onClick={() => onAppointmentClick(item)}>
                  <div className="font-semibold text-gray-800">{format(new Date(item.startTime), 'h:mm a')} - {format(new Date(item.endTime), 'h:mm a')}</div>
                  <div className="text-gray-600 truncate">{item.title}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Month View ---
const MonthView = ({ calendarDays, selectedDate, setSelectedDate, itemsByDate }: any) => (
  <div className="flex-1 flex flex-col overflow-hidden">
    <div className="grid grid-cols-7 flex-shrink-0 bg-[#F9FAFB]">
      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
        <div key={day} className="text-center text-sm font-medium border py-3 border-neutral-border-light">{day}</div>
      ))}
    </div>
    <div className="grid grid-cols-7 auto-rows-fr flex-1 min-h-0 !pt-0">
      {calendarDays.map((day: Date, idx: number) => {
        const dayItems = itemsByDate[format(day, 'yyyy-MM-dd')] || [];
        return (
          <div key={idx} className={cn("flex flex-col border p-2 cursor-pointer hover:bg-gray-50", !isSameMonth(day, selectedDate) && 'opacity-40', isSameDay(day, selectedDate) && 'bg-blue-50 border-primary-blue')} onClick={() => setSelectedDate(day)}>
            <div className="text-sm mb-1.5 flex-shrink-0"><span className={isSameDay(day, new Date()) ? 'font-bold text-white bg-primary-blue p-1.5 rounded-md' : ''}>{format(day, 'd')}</span></div>
            <div className="flex-1 space-y-1 overflow-hidden min-h-0">
              {dayItems.slice(0, 2).map((item: any) => (
                <AppointmentPopover key={item.id} apt={item}>
                  <div className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-[#F7F8FA]" onClick={e => e.stopPropagation()}>
                    <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || ''))} />
                    <span className="truncate">{format(parseISO(item.startTime), 'h:mma')} {item.title}</span>
                  </div>
                </AppointmentPopover>
              ))}
              {dayItems.length > 2 && <div className="text-xs text-gray-500 mt-1 px-1">{dayItems.length - 2} more</div>}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// --- Agenda View ---
const AgendaView = ({ isLoading, agendaGroups, onAppointmentClick }: any) => (
  <div className="flex-1 overflow-y-auto bg-white px-6 py-4">
    {isLoading ? <div className="flex justify-center p-8 text-gray-500">Loading...</div> : agendaGroups.length === 0 ? <div className="flex justify-center p-8 text-gray-500">No appointments found</div> : (
      <div className="divide-y divide-gray-200">
        {agendaGroups.map(({ date, items }: any, index: number) => (
          <div key={date} className={cn('border rounded-2xl pb-4', index > 0 && 'mt-2 mb-10')}>
            <div className="flex justify-between px-6 mb-3 bg-[#F7F8FA] py-4 rounded-t-2xl">
              <div className={`text-b14-600 text-neutral-dark-grey ${isSameDay(parseISO(date), new Date()) ? 'text-primary-blue' : 'text-neutral-dark-grey'}`}>{format(parseISO(date), 'MMM d, yyyy - EEEE')}</div>
              <div className="text-sm text-neutral-dark-grey">{items.length} appointments</div>
            </div>
            <div className="space-y-2 px-6">
              {items.map((item: any) => <AgendaCard key={item.id} item={item} onClick={() => onAppointmentClick(item)} />)}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
const AppointmentCalendarPage = () => {
  const { getSearchParamsObject, searchParams, setParams } = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<IAppointment | null>(null);

  // URL State
  const currentView = searchParams.get('view') || 'month';
  const currentTab = searchParams.get('tab') || 'appointment';
  const userId = searchParams.get('userId') || undefined;

  // Use Custom Hook for Data
  const {
    isLoading, timeSlots, weekDays, calendarDays, itemsByDate, agendaGroups
  } = useCalendarData(selectedDate, currentView, currentTab, userId, getSearchParamsObject);

  const selectedDateItems = itemsByDate[format(selectedDate, 'yyyy-MM-dd')] || [];

  // Handlers
  const handleDateChange = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') return setSelectedDate(new Date());
    const amount = direction === 'next' ? 1 : -1;

    if (currentView === 'month') setSelectedDate(addDays(direction === 'next' ? endOfMonth(selectedDate) : startOfMonth(selectedDate), amount));
    else if (currentView === 'week' || currentView === 'work-week') setSelectedDate(addDays(selectedDate, amount * 7));
    else if (currentView === 'agenda') setSelectedDate(addDays(selectedDate, amount * 30));
    else setSelectedDate(addDays(selectedDate, amount));
  };

  const handleAppointmentClick = useCallback((appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-66px)] overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Appointment calendar</h3>
      </Portal>

      <Container className="flex flex-col flex-1 min-h-0 overflow-hidden !p-6">
        <div className="flex flex-col h-full bg-white rounded-lg p-4 overflow-hidden flex-1 min-h-0">

          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => handleDateChange('today')}>Today</Button>
              <div className="flex items-center gap-2 border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleDateChange('prev')}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {(currentView === 'week' || currentView === 'work-week')
                    ? `${format(weekDays[0], 'd MMM')} - ${format(weekDays[weekDays.length - 1], 'd MMM, yyyy')}`
                    : currentView === 'agenda'
                      ? `${format(selectedDate, 'd MMM, yyyy')} - ${format(addDays(selectedDate, 30), 'd MMM, yyyy')}`
                      : format(selectedDate, 'd MMM, yyyy')}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleDateChange('next')}><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <UserSelectWithCommand value={userId || ''} placeholder={userId ? 'Selected' : 'User Selection: All selected'} onSelect={(val) => { if (val) setParams([{ name: 'userId', value: val }]); }} className="w-[240px]" />
                {userId && <Button variant="ghost" size="icon" onClick={() => setParams([{ name: 'userId', value: '' }])} className="flex-shrink-0" title="Clear filter"><X className="h-4 w-4" /></Button>}
              </div>
            </div>
            <div className="flex items-center rounded-3xl p-1 bg-[#F7F8FA] border border-light-grey">
              {VIEW_OPTIONS.map(view => (
                <Button key={view.key} variant={currentView === view.key ? 'primary' : 'ghost'} size="sm" className="rounded-full" onClick={() => setParams([{ name: 'view', value: view.key }])}>{view.label}</Button>
              ))}
            </div>
          </div>

          <TabSelector tabs={TAB_CONFIG} activeTab={currentTab} onTabChange={(tab) => setParams([{ name: 'tab', value: tab }])} className="mb-4 flex-shrink-0" />

          {/* Main Layout Area */}
          <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
            <div className={cn("flex-1 flex flex-col min-w-0 border rounded-lg overflow-hidden", currentView === 'agenda' && 'border-0')}>
              {currentView === 'day' && <DayView selectedDate={selectedDate} timeZone="Asia/Kolkata" itemsByDate={itemsByDate} onAppointmentClick={handleAppointmentClick} timeSlots={timeSlots} />}
              {(currentView === 'week' || currentView === 'work-week') && <WeekView weekDays={weekDays} selectedDate={selectedDate} setSelectedDate={setSelectedDate} itemsByDate={itemsByDate} onAppointmentClick={handleAppointmentClick} />}
              {currentView === 'agenda' && <AgendaView isLoading={isLoading} agendaGroups={agendaGroups} onAppointmentClick={handleAppointmentClick} />}
              {currentView === 'month' && <MonthView calendarDays={calendarDays} selectedDate={selectedDate} setSelectedDate={setSelectedDate} itemsByDate={itemsByDate} />}
            </div>

            {/* Right Sidebar */}
            {currentView !== 'agenda' && (
              <div className="w-80 flex flex-col flex-shrink-0 rounded-lg p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h4 className="text-b14-600">{format(selectedDate, 'd MMM, yyyy')}</h4>
                  {currentTab === 'appointment' && <Button LeftIcon={Plus} onClick={() => setIsFormModalOpen(true)} size="sm" className='text-primary' variant="ghost">Add</Button>}
                </div>

                {currentTab === 'appointment' ? (
                  <AppointmentList appointments={selectedDateItems} onAppointmentClick={handleAppointmentClick} isLoading={isLoading} />
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {selectedDateItems.length === 0 ? <div className="text-center text-gray-500 py-8">No events</div> : selectedDateItems.map((evt: any) => (
                      <div key={evt.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleAppointmentClick(evt)}>
                        <div className="font-semibold text-sm">{evt.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{format(parseISO(evt.startTime), 'h:mm a')} - {format(parseISO(evt.endTime), 'h:mm a')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Modals */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment} isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedAppointment(null); }}
          onEdit={(apt) => { setEditingAppointment(apt); setIsDetailModalOpen(false); setIsFormModalOpen(true); }}
          onDelete={() => { setIsDetailModalOpen(false); setSelectedAppointment(null); }}
        />
      )}
      <AppointmentFormModal isOpen={isFormModalOpen} onClose={() => { setIsFormModalOpen(false); setEditingAppointment(null); }} appointment={editingAppointment} selectedDate={selectedDate} />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const EventBlock = ({ item, dayDate, colIndex, totalCols, onClick }: any) => {
  const position = getAppointmentPosition(item, dayDate);
  if (!position) return null;

  const color = getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '', 'border') || {};

  // Calculate width and horizontal position
  const widthPercent = 100 / totalCols;
  const leftPercent = colIndex * widthPercent;

  return (
    <div
      className={cn(`absolute border-l-4 px-2 py-1 cursor-pointer hover:opacity-90 shadow-sm z-10 overflow-hidden bg-[#F2F2F2]`)}
      style={{
        top: position.top,
        height: position.height,
        minHeight: '24px',
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        ...color
      }}
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      <div className="text-[10px] font-medium truncate leading-tight">
        {format(new Date(item.startTime), 'h:mm a')}
      </div>
      <div className="text-xs font-bold truncate mt-0.5">
        {item.title}
      </div>
    </div>
  );
};

const AgendaCard = ({ item, onClick }: { item: IAppointment, onClick: () => void }) => {
  return (
    <div key={item.id} className="flex items-start gap-4 px-1 py-4 border-gray-200 cursor-pointer border-b last:border-b-0" onClick={onClick}>
      <div className={`w-1 ${getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '')} rounded-full flex-shrink-0 self-stretch`} />
      <div className="flex-shrink-0 text-sm font-medium text-neutral-black min-w-[148px] flex items-center gap-2 mr-8"><Clock className="h-4 w-4" /> {format(parseISO(item.startTime), 'h:mm a')} - {format(parseISO(item.endTime), 'h:mm a')}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-b14-600 mb-1">{item.title}</div>
        {item.description && <div className="text-b13 text-neutral-dark-grey mb-1">{item.description}</div>}
        {item?.lead && <div className="text-b13 text-neutral-dark-grey">{item.lead?.firstName} {item.lead?.lastName} | {item.lead?.email} | {item.lead?.phone}</div>}
      </div>

      {item?.user && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="text-sm text-neutral-dark-grey font-medium">{item.user.firstName} {item.user.lastName}</div>
          <div className={`w-8 h-8 rounded-full ${getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '')} text-white flex items-center justify-center text-xs font-semibold border-2`}>
            {getUserInitials(item.user.firstName, item.user.lastName)}
          </div>
        </div>
      )}
    </div>
  );
};

const AppointmentPopover = ({ apt, children }: { apt: any, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align='start' className="min-w-[504px]">
        <AppointmentPreview appointment={apt} onEdit={() => { }} onDelete={() => { }} onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
export default AppointmentCalendarPage;