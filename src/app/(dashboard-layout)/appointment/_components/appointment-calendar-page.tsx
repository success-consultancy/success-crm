'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays,
  isSameMonth, isSameDay, startOfDay, parseISO, getHours, getMinutes, differenceInMinutes
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Plus, X } from 'lucide-react';
import useSearchParams from '@/hooks/use-search-params';
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
import { useDeleteAppointment } from '@/mutations/appointments/delete-appointment';
import { useEditAppointment } from '@/mutations/appointments/edit-appointment';
import ConfirmationDialog from '@/components/organisms/confirmation-dialog';

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

const HOUR_HEIGHT = 64;
const ALL_DAY_HEIGHT = 0;
const START_HOUR = 6; // start from 7 but it also has all day column
const END_HOUR = 20; // 8 PM
const MIN_EVENT_WIDTH = 130;

const getUserInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

const getProcessedItems = (items: any[]) => {
  const sorted = [...items].sort((a, b) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  if (sorted.length === 0) return [];

  // 1. Group overlapping items into clusters (all connected events)
  const clusters: any[][] = [];
  let currentCluster: any[] = [];
  let clusterEnd: number | null = null;

  sorted.forEach(item => {
    const start = new Date(item.startTime).getTime();
    const end = new Date(item.endTime).getTime();

    if (clusterEnd === null || start < clusterEnd) {
      currentCluster.push(item);
      if (clusterEnd === null || end > clusterEnd) clusterEnd = end;
    } else {
      clusters.push(currentCluster);
      currentCluster = [item];
      clusterEnd = end;
    }
  });
  clusters.push(currentCluster);

  // 2. Assign columns for each cluster
  const result: any[] = [];
  clusters.forEach(cluster => {
    const columns: any[][] = [];
    cluster.forEach(item => {
      const itemStart = new Date(item.startTime).getTime();
      let placed = false;

      // Find the first column where this item doesn't overlap
      for (let i = 0; i < columns.length; i++) {
        const lastInCol = columns[i][columns[i].length - 1];
        if (itemStart >= new Date(lastInCol.endTime).getTime()) {
          columns[i].push(item);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([item]);
      }
    });

    const groupCols = columns.length;
    cluster.forEach(item => {
      const colIndex = columns.findIndex(col => col.includes(item));
      result.push({ ...item, colIndex, totalCols: groupCols });
    });
  });

  return result;
};

const getTopPosition = (date: Date | string) => {
  const d = new Date(date);
  const totalMinutes = getHours(d) * 60 + getMinutes(d);
  const startMinutesAt7AM = START_HOUR * 60;
  const minutesAfter7PM = END_HOUR * 60;

  // Account for All Day slot at the top
  if (totalMinutes < startMinutesAt7AM || totalMinutes > minutesAfter7PM) return ALL_DAY_HEIGHT;

  return ALL_DAY_HEIGHT + ((totalMinutes - startMinutesAt7AM) / 60) * HOUR_HEIGHT;
};

const getEventHeight = (startTime: Date | string, endTime: Date | string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMinutes = differenceInMinutes(end, start);
  return (durationMinutes / 60) * HOUR_HEIGHT;
};


const DayView = ({ selectedDate, timeSlots, itemsByDate, setSelectedDate, onAppointmentClick, onReschedule, onEmptySlotClick }: any) => {
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateItems = itemsByDate[dateKey] || [];

  const processedItems = useMemo(() => getProcessedItems(selectedDateItems), [selectedDateItems]);

  const maxConcurrency = useMemo(() => {
    return Math.max(0, ...processedItems.map((i: any) => i.totalCols));
  }, [processedItems]);


  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white">
      <div className="flex-1 overflow-y-scroll relative flex flex-col bg-[#F9FAFB]">
        {/* Header Grid */}
        <div className="sticky top-0 z-40 grid gap-px border-b flex-shrink-0 shadow-sm pt-1 bg-[#F9FAFB]" style={{ gridTemplateColumns: `98px repeat(2, 1fr)` }}>
          <div className="bg-[#F9FAFB] p-2" ></div>
          <div key={selectedDate.toString()} className={`p-2 flex flex-col cursor-pointer ml-[24px]`} onClick={() => setSelectedDate(selectedDate)}>
            <div className="text-b12-500 pl-1.5 text-neutral-dark-grey font-medium mb-1 text-left">{format(selectedDate, 'EEE')}</div>
            <div className={`text-lg font-semibold w-[36px] h-[36px] text-center flex justify-center items-center bg-primary rounded-full p-2 text-white`}>
              {format(selectedDate, 'd')}
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: '98px 1fr' }}>
          {/* Side Time Labels */}
          <div className="bg-white sticky left-0 z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
            {timeSlots.map((slot: any, idx: number) => (
              <div key={idx} className={`h-[98px] border-b border-gray-100 px-2 text-b12-500 text-neutral-dark-grey pt-2`}
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* Event Area */}
          <div className="bg-white relative min-h-full" style={{ minWidth: `${maxConcurrency * MIN_EVENT_WIDTH}px` }}>
            {timeSlots.map((slot: any, idx: number) => (
              <div key={idx} className={`h-[98px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                style={{ height: HOUR_HEIGHT }}
                onClick={(e) => {
                  if (slot.hour === null) return;
                  const minutes = e.nativeEvent.offsetY >= HOUR_HEIGHT / 2 ? 30 : 0;
                  const clickedDate = new Date(selectedDate);
                  clickedDate.setHours(slot.hour, minutes, 0, 0);
                  onEmptySlotClick?.(clickedDate);
                }}
              />
            ))}

            {renderCurrentTimeIndicator(selectedDate)}

            {/* Pass position metadata to EventBlock */}
            {processedItems.map((item: any) => (
              <EventBlock
                key={item.id}
                item={item}
                dayDate={selectedDate}
                colIndex={item.colIndex}
                totalCols={item.totalCols}
                onClick={() => onAppointmentClick(item)}
                onReschedule={onReschedule}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderCurrentTimeIndicator = (selectedDate: any) => {
  const now = new Date();
  const currentHour = getHours(now);
  if (currentHour < START_HOUR || currentHour >= END_HOUR || !isSameDay(selectedDate, now)) return null;
  const topPx = getTopPosition(now);

  return (
    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: `${topPx}px` }}>
      <div className="flex items-center">
        <div className="text-xs text-red-600 font-medium px-2 bg-white">{format(now, 'h:mm a')}</div>
        <div className="flex-1 h-0.5 bg-red-500"></div>
      </div>
    </div>
  );
};

// --- Week View ---
const WeekView = ({ weekDays, selectedDate, setSelectedDate, itemsByDate, onAppointmentClick, timeSlots, onReschedule, onEmptySlotClick }: any) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white">
      <div className="flex-1 overflow-y-scroll relative flex flex-col">
        {/* Header Grid */}
        <div className="sticky top-0 z-30 grid gap-px bg-gray-200 border-b flex-shrink-0 shadow-sm pt-1" style={{ gridTemplateColumns: `98px repeat(${weekDays.length}, 1fr)` }}>
          <div className="bg-[#F9FAFB] p-2" />
          {weekDays.map((day: Date) => (
            <div key={day.toString()} className={`flex flex-col bg-[#F9FAFB] p-2 items-center cursor-pointer hover:bg-gray-50 ${isSameDay(day, selectedDate) ? 'bg-blue-50 border-b-2 border-blue-500' : ''}`} onClick={() => setSelectedDate(day)}>
              <div className="text-b12-500 text-neutral-dark-grey font-medium mb-1 text-left">{format(day, 'EEE')}</div>
              <div className={`text-lg font-semibold w-[36px] h-[36px] text-center flex justify-center items-center ${isSameDay(day, new Date()) ? 'bg-primary rounded-full p-2 text-white' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Event Area */}
        <div className="flex-1 grid gap-px bg-gray-200" style={{ gridTemplateColumns: `98px repeat(${weekDays.length}, 1fr)` }}>
          {/* Time Labels */}
          <div className="bg-white flex flex-col relative">
            {timeSlots.map((slot: any, i: number) => (
              <div key={i} className="relative border-b border-gray-100 flex items-start justify-center text-b12-500 text-neutral-dark-grey" style={{
                height: HOUR_HEIGHT
              }}>
                <span className="relative pt-2 bg-white px-1">{slot.label}</span>
              </div>
            ))}

            {renderCurrentTimeIndicator(selectedDate)}
          </div>

          {/* Event Columns */}
          {weekDays.map((day: Date) => (
            <div key={day.toString()} className="bg-white relative">
              {timeSlots.map((slot: any, i: number) => (
                <div key={i} className="border-b border-gray-100 w-full hover:bg-gray-50 cursor-pointer" style={{ height: HOUR_HEIGHT }}
                  onClick={(e) => {
                    if (slot.hour === null) return;
                    const minutes = e.nativeEvent.offsetY >= HOUR_HEIGHT / 2 ? 30 : 0;
                    const clickedDate = new Date(day);
                    clickedDate.setHours(slot.hour, minutes, 0, 0);
                    onEmptySlotClick?.(clickedDate);
                  }}
                />
              ))}
              {isSameDay(day, new Date()) && getHours(currentTime) >= START_HOUR && getHours(currentTime) < END_HOUR && (
                <div className="absolute left-0 right-0 border-t-2 border-red-500 z-20" style={{ top: `${getTopPosition(currentTime)}px` }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -left-1.5 -top-[5px]" />
                </div>
              )}
              {(() => {
                const dayItems = itemsByDate[format(day, 'yyyy-MM-dd')] || [];
                const dayProcessed = getProcessedItems(dayItems);

                return dayProcessed.map((item: any) => (
                  <EventBlock
                    key={item.id}
                    item={item}
                    dayDate={day}
                    colIndex={item.colIndex}
                    totalCols={item.totalCols}
                    onClick={() => onAppointmentClick(item)}
                    onReschedule={onReschedule}
                  />
                ));
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Month View ---
const MonthView = ({ calendarDays, selectedDate, setSelectedDate, itemsByDate, setEditingAppointment, onEmptySlotClick }: any) => (
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
          <div key={idx} className={cn("flex flex-col border p-2 cursor-pointer hover:bg-gray-50", !isSameMonth(day, selectedDate) && 'opacity-40', isSameDay(day, selectedDate) && 'bg-blue-50 border-primary-blue')} onClick={() => { setSelectedDate(day); onEmptySlotClick?.(day); }}>
            <div className="text-sm mb-1.5 flex-shrink-0"><span className={isSameDay(day, new Date()) ? 'font-bold text-white bg-primary-blue p-1.5 rounded-md' : ''}>{format(day, 'd')}</span></div>
            <div className="flex-1 space-y-1 overflow-hidden min-h-0">
              {dayItems.slice(0, 2).map((item: any) => (
                <AppointmentPopover setEditingAppointment={setEditingAppointment} key={item.id} apt={item}>
                  <div className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-bluish-grey" onClick={e => e.stopPropagation()}>
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
    )
    }
  </div >
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
  const [prefilledDate, setPrefilledDate] = useState<Date | undefined>(undefined);

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

  const handleEdit = useCallback((appointment: IAppointment) => {
    setEditingAppointment(appointment);
    setPrefilledDate(undefined);
    setIsFormModalOpen(true);
  }, [setEditingAppointment, setIsFormModalOpen]);

  const handleEmptySlotClick = useCallback((date: Date) => {
    setEditingAppointment(null);
    setPrefilledDate(date);
    setIsFormModalOpen(true);
  }, []);

  const { mutateAsync: editAppointment } = useEditAppointment();

  const handleReschedule = useCallback(async (item: IAppointment, newStart: Date, newEnd: Date) => {
    await editAppointment({
      id: item.id,
      title: item.title,
      description: item.description,
      date: format(newStart, "yyyy-MM-dd'T'HH:mm:ss"),
      startTime: format(newStart, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(newEnd, "yyyy-MM-dd'T'HH:mm:ss"),
      clientId: item.clientId ?? item.lead?.id ?? null,
      ownerId: item.userId,
      type: item.type,
      status: item.status,
    });
  }, [editAppointment]);

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
              {currentView === 'day' && <DayView selectedDate={selectedDate} timeZone="Asia/Kolkata" itemsByDate={itemsByDate} onAppointmentClick={handleAppointmentClick} timeSlots={timeSlots} onReschedule={handleReschedule} onEmptySlotClick={handleEmptySlotClick} />}
              {(currentView === 'week' || currentView === 'work-week') && <WeekView weekDays={weekDays} selectedDate={selectedDate} setSelectedDate={setSelectedDate} itemsByDate={itemsByDate} onAppointmentClick={handleAppointmentClick} timeSlots={timeSlots} onReschedule={handleReschedule} onEmptySlotClick={handleEmptySlotClick} />}
              {currentView === 'agenda' && <AgendaView isLoading={isLoading} agendaGroups={agendaGroups} onAppointmentClick={handleAppointmentClick} />}
              {currentView === 'month' && <MonthView calendarDays={calendarDays} selectedDate={selectedDate} setSelectedDate={setSelectedDate} itemsByDate={itemsByDate} setEditingAppointment={handleEdit} onEmptySlotClick={handleEmptySlotClick} />}
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
      <AppointmentFormModal isOpen={isFormModalOpen} onClose={() => { setIsFormModalOpen(false); setEditingAppointment(null); setPrefilledDate(undefined); }} appointment={editingAppointment} selectedDate={prefilledDate ?? selectedDate} />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const SNAP_MINUTES = 30;
const SNAP_PX = (SNAP_MINUTES / 60) * HOUR_HEIGHT; // 32px per 30 min

const formatTimeLabel = (start: Date, end: Date) => {
  const startPeriod = format(start, 'a').toLowerCase();
  const endPeriod = format(end, 'a').toLowerCase();
  const startFormatted = startPeriod === endPeriod
    ? format(start, 'h:mm')
    : format(start, 'h:mm a').toLowerCase();
  return `${startFormatted} - ${format(end, 'h:mm a').toLowerCase()}`;
};

const EventBlock = ({ item, colIndex, totalCols, onClick, onReschedule }: any) => {
  const widthPercent = 100 / totalCols;
  const leftPercent = colIndex * widthPercent;
  const rightInsetPx = totalCols > 1 ? 4 : 0;

  const originalStart = new Date(item.startTime);
  const originalEnd = new Date(item.endTime);
  const durationMs = originalEnd.getTime() - originalStart.getTime();

  // Saving state — held at optimistic position while API is in-flight
  const [isSaving, setIsSaving] = useState(false);
  const [savedTopPx, setSavedTopPx] = useState<number | null>(null);
  const [savedHeightPx, setSavedHeightPx] = useState<number | null>(null);

  // --- Move-drag state ---
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number>(0);
  const dragRef = useRef<HTMLDivElement>(null);

  // --- Resize state (bottom handle) ---
  const [resizeOffsetPx, setResizeOffsetPx] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef<number>(0);

  // --- Resize state (top handle) ---
  const [topResizeOffsetPx, setTopResizeOffsetPx] = useState(0);
  const [isTopResizing, setIsTopResizing] = useState(false);
  const topResizeStartY = useRef<number>(0);

  const baseTop = getTopPosition(item.startTime);
  const baseHeight = Math.max(getEventHeight(item.startTime, item.endTime), 44);

  const snappedMoveSteps = Math.round(dragOffsetPx / SNAP_PX);
  const snappedMovePx = snappedMoveSteps * SNAP_PX;
  const snappedMoveMinutes = snappedMoveSteps * SNAP_MINUTES;
  const previewStart = new Date(originalStart.getTime() + snappedMoveMinutes * 60_000);
  const previewEnd = new Date(previewStart.getTime() + durationMs);

  const rawResizeSteps = Math.round(resizeOffsetPx / SNAP_PX);
  const resizeSteps = Math.max(rawResizeSteps, 1 - Math.round(baseHeight / SNAP_PX));
  const resizeSnappedPx = resizeSteps * SNAP_PX;
  const resizePreviewEnd = new Date(originalEnd.getTime() + resizeSteps * SNAP_MINUTES * 60_000);

  const rawTopResizeSteps = Math.round(topResizeOffsetPx / SNAP_PX);
  const topResizeSteps = Math.min(rawTopResizeSteps, Math.round(baseHeight / SNAP_PX) - 1);
  const topResizeSnappedPx = topResizeSteps * SNAP_PX;
  const topResizePreviewStart = new Date(originalStart.getTime() + topResizeSteps * SNAP_MINUTES * 60_000);

  const displayTop = isSaving && savedTopPx !== null
    ? savedTopPx
    : isDragging ? baseTop + snappedMovePx
    : isTopResizing ? baseTop + topResizeSnappedPx
    : baseTop;

  const displayHeight = isSaving && savedHeightPx !== null
    ? savedHeightPx
    : isResizing ? Math.max(baseHeight + resizeSnappedPx, SNAP_PX)
    : isTopResizing ? Math.max(baseHeight - topResizeSnappedPx, SNAP_PX)
    : baseHeight;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isSaving) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartY.current = e.clientY;
    setIsDragging(true);
    setDragOffsetPx(0);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setDragOffsetPx(e.clientY - dragStartY.current);
  };
  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);

    if (snappedMoveSteps === 0) {
      onClick();
      setDragOffsetPx(0);
      return;
    }

    if (onReschedule) {
      // Lock block at dropped position while API is saving
      setSavedTopPx(baseTop + snappedMovePx);
      setIsSaving(true);
      setDragOffsetPx(0);
      try {
        await onReschedule(item, previewStart, previewEnd);
      } finally {
        setIsSaving(false);
        setSavedTopPx(null);
      }
    } else {
      setDragOffsetPx(0);
    }
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isSaving) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeStartY.current = e.clientY;
    setIsResizing(true);
    setResizeOffsetPx(0);
  };
  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.stopPropagation();
    setResizeOffsetPx(e.clientY - resizeStartY.current);
  };
  const handleResizePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.stopPropagation();
    setIsResizing(false);

    if (resizeSteps !== 0 && onReschedule) {
      // Lock block at resized height while API is saving
      setSavedHeightPx(Math.max(baseHeight + resizeSnappedPx, SNAP_PX));
      setIsSaving(true);
      setResizeOffsetPx(0);
      try {
        await onReschedule(item, originalStart, resizePreviewEnd);
      } finally {
        setIsSaving(false);
        setSavedHeightPx(null);
      }
    } else {
      setResizeOffsetPx(0);
    }
  };

  const handleTopResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isSaving) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    topResizeStartY.current = e.clientY;
    setIsTopResizing(true);
    setTopResizeOffsetPx(0);
  };
  const handleTopResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTopResizing) return;
    e.stopPropagation();
    setTopResizeOffsetPx(e.clientY - topResizeStartY.current);
  };
  const handleTopResizePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTopResizing) return;
    e.stopPropagation();
    setIsTopResizing(false);

    if (topResizeSteps !== 0 && onReschedule) {
      setSavedHeightPx(Math.max(baseHeight - topResizeSnappedPx, SNAP_PX));
      setSavedTopPx(baseTop + topResizeSnappedPx);
      setIsSaving(true);
      setTopResizeOffsetPx(0);
      try {
        await onReschedule(item, topResizePreviewStart, originalEnd);
      } finally {
        setIsSaving(false);
        setSavedHeightPx(null);
        setSavedTopPx(null);
      }
    } else {
      setTopResizeOffsetPx(0);
    }
  };

  const isActive = isDragging || isResizing || isTopResizing;
  const activeTimeLabel = isTopResizing
    ? formatTimeLabel(topResizePreviewStart, originalEnd)
    : isResizing
      ? formatTimeLabel(originalStart, resizePreviewEnd)
      : isDragging
        ? formatTimeLabel(previewStart, previewEnd)
        : formatTimeLabel(originalStart, originalEnd);

  return (
    <div
      ref={dragRef}
      className={cn(
        'absolute z-10 overflow-hidden bg-[#F2F2F2] flex items-stretch',
        isActive
          ? 'cursor-grabbing opacity-80 shadow-lg ring-2 ring-primary ring-offset-1'
          : isSaving
            ? 'cursor-wait ring-2 ring-primary/40 ring-offset-1'
            : 'cursor-grab hover:opacity-90 transition-opacity',
      )}
      style={{
        top: `${displayTop}px`,
        height: `${Math.max(displayHeight, 44)}px`,
        left: `${leftPercent}%`,
        width: `calc(${widthPercent}% - ${rightInsetPx}px)`,
        minWidth: `${MIN_EVENT_WIDTH}px`,
        userSelect: 'none',
        touchAction: 'none',
        transition: isActive ? 'none' : 'top 0.2s ease, height 0.2s ease',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { setIsDragging(false); setDragOffsetPx(0); }}
    >
      {/* Colored left border indicator */}
      <div className={cn('w-[3px] flex-shrink-0 rounded-l-sm', getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '', 'tailwind'))} />
      <div className='flex flex-col overflow-hidden px-2 py-1 flex-1'>
        <div className={cn('text-b12-500 text-neutral-black leading-tight truncate', isActive && 'font-semibold')}>
          {activeTimeLabel}
        </div>
        <div className="text-b12 text-neutral-black mt-0.5 truncate">
          {item.title}
        </div>
      </div>

      {/* Saving shimmer overlay */}
      {isSaving && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm">
          <div className="absolute inset-0 bg-white/30 animate-pulse" />
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_ease-in-out_infinite]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
              animation: 'shimmer 1.2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Top resize handle */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-3 flex items-center justify-center group cursor-n-resize',
          isSaving && 'pointer-events-none',
        )}
        onPointerDown={handleTopResizePointerDown}
        onPointerMove={handleTopResizePointerMove}
        onPointerUp={handleTopResizePointerUp}
        onPointerCancel={() => { setIsTopResizing(false); setTopResizeOffsetPx(0); }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-8 h-1 rounded-full bg-neutral-400 opacity-0 group-hover:opacity-60 transition-opacity" />
      </div>

      {/* Bottom resize handle */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-3 flex items-center justify-center group cursor-s-resize',
          isSaving && 'pointer-events-none',
        )}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={() => { setIsResizing(false); setResizeOffsetPx(0); }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-8 h-1 rounded-full bg-neutral-400 opacity-0 group-hover:opacity-60 transition-opacity" />
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

const AppointmentPopover = ({ setEditingAppointment, apt, children }: { setEditingAppointment: (appointment: any) => void, apt: any, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync: deleteAppointment } = useDeleteAppointment();

  const handleEdit = () => {
    console.log('Editing appointment:', apt);
    setEditingAppointment(apt);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAppointment(apt.id);
      setIsDeleteDialogOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent align='start' className="min-w-[504px]">
          <AppointmentPreview appointment={apt} onEdit={handleEdit} onDelete={handleDeleteClick} onClose={() => setIsOpen(false)} />
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title="Delete Appointment"
        message={`Are you sure you want to delete "${apt.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
};
export default AppointmentCalendarPage;