'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, View as RBCView } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import {
  format, parse, startOfWeek, getDay, parseISO,
  addDays, isSameDay, startOfMonth, endOfMonth,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Plus, X } from 'lucide-react';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar-overrides.css';

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
import { Skeleton } from '@/components/ui/skeleton';

// ==========================================
// CONSTANTS
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

// ==========================================
// REACT-BIG-CALENDAR SETUP
// ==========================================
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

const MIN_TIME = new Date(1970, 1, 1, 6, 0, 0);
const MAX_TIME = new Date(1970, 1, 1, 20, 0, 0);
const SCROLL_TO_TIME = new Date(1970, 1, 1, 7, 0, 0);

const toRBCEvent = (item: IAppointment) => ({
  id: item.id,
  title: item.title,
  start: parseISO(item.startTime),
  end: parseISO(item.endTime),
  resource: item,
});

const getRBCView = (view: string): RBCView => {
  const map: Record<string, RBCView> = {
    month: Views.MONTH,
    week: Views.WEEK,
    'work-week': Views.WORK_WEEK,
    day: Views.DAY,
  };
  return map[view] || Views.MONTH;
};

const getUserInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

// ==========================================
// CONTEXT for stable module-level RBC components
// ==========================================
interface CalendarCtx {
  onDayClick: (date: Date) => void;
  onEditAppointment: (apt: IAppointment) => void;
  loadingEventIds: Set<string>;
}
const CalendarContext = React.createContext<CalendarCtx>({
  onDayClick: () => { },
  onEditAppointment: () => { },
  loadingEventIds: new Set(),
});

// ==========================================
// STABLE CUSTOM RBC COMPONENTS
// ==========================================
const EmptyToolbar = () => null;

const CustomTimeEvent = ({ event }: any) => {
  const { loadingEventIds } = React.useContext(CalendarContext);
  const item = event.resource as IAppointment;
  const start = event.start as Date;
  const end = event.end as Date;
  const startPeriod = format(start, 'a').toLowerCase();
  const endPeriod = format(end, 'a').toLowerCase();
  const startStr = startPeriod === endPeriod ? format(start, 'h:mm') : format(start, 'h:mm a').toLowerCase();
  const timeLabel = `${startStr} - ${format(end, 'h:mm a').toLowerCase()}`;
  const colorStr = getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '', 'raw') as string;
  const isLoading = loadingEventIds.has(event.id);
  const client = item.client ?? item.lead;
  const clientName = client ? `${client.firstName} ${client.lastName}` : '';
  const userName = item.user ? `${item.user.firstName} ${item.user.lastName}` : '';
  const eventLabel = `${clientName ? `${clientName} - ` : ''}${item.title}${userName ? ` x ${userName}` : ''}`;

  return (
    <div className="flex items-stretch h-full overflow-hidden rounded-sm relative border transition-colors hover:brightness-95 hover:bg-blue-50" style={{ borderColor: "#F2F2F2" }}>
      <div className="w-[3px] flex-shrink-0 rounded-l-sm" style={{ backgroundColor: colorStr }} />
      <div className="flex flex-col overflow-hidden px-2 py-1 flex-1 bg-[#F7F8FA]">
        <div className="text-[11px] font-medium text-neutral-black leading-tight truncate">{timeLabel}</div>
        <div className="text-[11px] text-neutral-black mt-0.5 truncate">{eventLabel}</div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

const CustomMonthDateHeader = ({ date }: any) => (
  <div className="mb-1.5 py-1 px-1 text-left mt-2 ml-[10px] text-b12-500">
    <span className={isSameDay(date, new Date()) ? 'font-bold text-white bg-primary-blue p-1.5 rounded-md' : ''}>
      {format(date, 'd')}
    </span>
  </div>
);

const CustomMonthColumnHeader = ({ label }: any) => {
  const fullNames: Record<string, string> = {
    'Sun': 'Sunday', 'Mon': 'Monday', 'Tue': 'Tuesday',
    'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday',
  };
  return (
    <div className="text-center text-sm font-medium py-3">{fullNames[label] || label}</div>
  );
};

const WeekDayHeader = ({ date }: any) => {
  const { onDayClick } = React.useContext(CalendarContext);
  return (
    <div
      role="button"
      tabIndex={0}
      className="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-50"
      onClick={() => onDayClick(date)}
      onKeyDown={e => e.key === 'Enter' && onDayClick(date)}
    >
      <div className="text-[12px] font-medium text-neutral-dark-grey mb-1">{format(date, 'EEE')}</div>
      <div className={`text-lg font-semibold w-[36px] h-[36px] flex justify-center items-center
        ${isSameDay(date, new Date()) ? 'bg-primary rounded-full text-white' : ''}`}>
        {format(date, 'd')}
      </div>
    </div>
  );
};

const MonthEvent = ({ event }: any) => {
  const { onEditAppointment, loadingEventIds } = React.useContext(CalendarContext);
  const item = event.resource as IAppointment;
  const isLoading = loadingEventIds.has(event.id);
  const client = item.client ?? item.lead;
  const clientName = client ? `${client.firstName} ${client.lastName}` : '';
  const userName = item.user ? `${item.user.firstName} ${item.user.lastName}` : '';
  const label = `${clientName ? `${clientName} - ` : ''}${item.title}${userName ? ` x ${userName}` : ''}`;
  return (
    <AppointmentPopover setEditingAppointment={onEditAppointment} apt={item}>
      <div
        role="button"
        tabIndex={0}
        className="px-1 py-0.5 rounded cursor-pointer transition-colors hover:brightness-95 hover:!bg-blue-100 flex items-center gap-1.5 !bg-bluish-grey text-b12-500 ml-[10px] mr-[10px]"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || ''))} />
        <span className="truncate">{label}</span>
        {isLoading && (
          <div className="w-2.5 h-2.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin ml-auto flex-shrink-0" />
        )}
      </div>
    </AppointmentPopover>
  );
};

// ==========================================
// SKELETON COMPONENTS
// ==========================================
const AgendaSkeletonRow = () => (
  <div className="flex items-start gap-4 px-1 py-4 border-b last:border-b-0">
    <Skeleton className="w-1 h-12 rounded-full flex-shrink-0 self-stretch" />
    <Skeleton className="h-5 w-36 flex-shrink-0 mr-8" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
  </div>
);

const AgendaSkeletonCard = () => (
  <div className="border rounded-2xl pb-4">
    <div className="flex justify-between px-6 mb-3 bg-[#F7F8FA] py-4 rounded-t-2xl">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="px-6">
      {[1, 2, 3].map(i => <AgendaSkeletonRow key={i} />)}
    </div>
  </div>
);

const CalendarGridSkeleton = () => (
  <div className="absolute inset-0 bg-white/80 z-10 pointer-events-none">
    <Skeleton className="absolute h-6 w-24 rounded-sm" style={{ top: '18%', left: '15%' }} />
    <Skeleton className="absolute h-10 w-32 rounded-sm" style={{ top: '30%', left: '35%' }} />
    <Skeleton className="absolute h-6 w-20 rounded-sm" style={{ top: '30%', left: '60%' }} />
    <Skeleton className="absolute h-14 w-28 rounded-sm" style={{ top: '48%', left: '22%' }} />
    <Skeleton className="absolute h-6 w-24 rounded-sm" style={{ top: '55%', left: '50%' }} />
    <Skeleton className="absolute h-10 w-20 rounded-sm" style={{ top: '68%', left: '72%' }} />
  </div>
);

// ==========================================
// AGENDA VIEW (original design preserved)
// ==========================================
const AgendaView = ({ isLoading, agendaGroups, onAppointmentClick }: any) => (
  <div className="flex-1 overflow-y-auto bg-white px-6 py-4">

    {isLoading ? (
      <div className="divide-y divide-gray-200 space-y-4">
        <AgendaSkeletonCard />
        <AgendaSkeletonCard />
      </div>
    ) : agendaGroups.length === 0 ? (
      <div className="flex justify-center p-8 text-gray-500">No appointments found</div>
    ) : (
      <div className="divide-y divide-gray-200">
        {agendaGroups.map(({ date, items }: any, index: number) => (
          <div key={date} className={cn('border rounded-2xl pb-4', index > 0 && 'mt-2 mb-10')}>
            <div className="flex justify-between px-6 mb-3 bg-[#F7F8FA] py-4 rounded-t-2xl">
              <div className={`text-b14-600 ${isSameDay(parseISO(date), new Date()) ? 'text-primary-blue' : 'text-neutral-dark-grey'}`}>
                {format(parseISO(date), 'MMM d, yyyy - EEEE')}
              </div>
              <div className="text-sm text-neutral-dark-grey">{items.length} appointments</div>
            </div>
            <div className="space-y-2 px-6">
              {items.map((item: any) => (
                <AgendaCard key={item.id} item={item} onClick={() => onAppointmentClick(item)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
const AppointmentCalendarPage = () => {
  const { getSearchParamsObject, searchParams, setParams } = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<IAppointment | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<Date | undefined>(undefined);
  const [prefilledEndDate, setPrefilledEndDate] = useState<Date | undefined>(undefined);

  const currentView = searchParams.get('view') || 'month';
  const currentTab = searchParams.get('tab') || 'appointment';
  const userId = searchParams.get('userId') || undefined;

  const { isLoading, weekDays, itemsByDate, agendaGroups } = useCalendarData(
    selectedDate, currentView, currentTab, userId, getSearchParamsObject
  );

  const selectedDateItems = itemsByDate[format(selectedDate, 'yyyy-MM-dd')] || [];

  const rbcEvents = useMemo(
    () => Object.values(itemsByDate).flat().map(toRBCEvent),
    [itemsByDate]
  );

  const [optimisticOverrides, setOptimisticOverrides] = useState<Record<string, { start: Date; end: Date }>>({});
  const [loadingEventIds, setLoadingEventIds] = useState<Set<string>>(new Set());

  // Once the API refetch updates rbcEvents, clear overrides (API data is now authoritative)
  useEffect(() => {
    setOptimisticOverrides({});
  }, [rbcEvents]);

  const displayEvents = useMemo(
    () => rbcEvents.map(event => {
      const override = optimisticOverrides[event.id];
      return override ? { ...event, ...override } : event;
    }),
    [rbcEvents, optimisticOverrides]
  );

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
  }, []);

  const handleEmptySlotClick = useCallback((date: Date, endDate?: Date) => {
    setEditingAppointment(null);
    setPrefilledDate(date);
    setPrefilledEndDate(endDate);
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

  const handleEventDrop = useCallback(async ({ event, start, end }: any) => {
    const id = event.id;
    setOptimisticOverrides(prev => ({ ...prev, [id]: { start: start as Date, end: end as Date } }));
    setLoadingEventIds(prev => new Set(prev).add(id));
    try {
      await handleReschedule(event.resource as IAppointment, start as Date, end as Date);
    } catch {
      setOptimisticOverrides(prev => { const next = { ...prev }; delete next[id]; return next; });
    } finally {
      setLoadingEventIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  }, [handleReschedule]);

  const handleEventResize = useCallback(async ({ event, start, end }: any) => {
    const id = event.id;
    setOptimisticOverrides(prev => ({ ...prev, [id]: { start: start as Date, end: end as Date } }));
    setLoadingEventIds(prev => new Set(prev).add(id));
    try {
      await handleReschedule(event.resource as IAppointment, start as Date, end as Date);
    } catch {
      setOptimisticOverrides(prev => { const next = { ...prev }; delete next[id]; return next; });
    } finally {
      setLoadingEventIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  }, [handleReschedule]);

  const handleSelectEvent = useCallback((event: any) => {
    handleAppointmentClick(event.resource as IAppointment);
  }, [handleAppointmentClick]);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setSelectedDate(start);
    handleEmptySlotClick(start, end);
  }, [handleEmptySlotClick]);

  const calendarCtx = useMemo<CalendarCtx>(
    () => ({ onDayClick: setSelectedDate, onEditAppointment: handleEdit, loadingEventIds }),
    [handleEdit, loadingEventIds]
  );

  // Stable component map — all components are defined at module scopeq
  const components = useMemo(() => ({
    toolbar: EmptyToolbar,
    event: CustomTimeEvent,
    header: WeekDayHeader,   // week / work_week
    day: { header: WeekDayHeader },        // day view
    week: { header: WeekDayHeader },       // explicit for week
    work_week: { header: WeekDayHeader },  // explicit for work_week
    month: {
      header: CustomMonthColumnHeader,
      dateHeader: CustomMonthDateHeader,
      event: MonthEvent,
    },
  }), []);

  const eventPropGetter = useCallback(() => ({
    style: { backgroundColor: 'transparent', border: 'none', padding: 0, boxShadow: 'none' },
  }), []);

  const rbcView = currentView !== 'agenda' ? getRBCView(currentView) : Views.MONTH;

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
                <UserSelectWithCommand
                  value={userId || ''}
                  placeholder={userId ? 'Selected' : 'User Selection: All selected'}
                  onSelect={(val) => { if (val) setParams([{ name: 'userId', value: val }]); }}
                  className="w-[240px]"
                />
                {userId && (
                  <Button variant="ghost" size="icon" onClick={() => setParams([{ name: 'userId', value: '' }])} className="flex-shrink-0" title="Clear filter">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center rounded-3xl p-1 bg-[#F7F8FA] border border-light-grey">
              {VIEW_OPTIONS.map(view => (
                <Button
                  key={view.key}
                  variant={currentView === view.key ? 'primary' : 'ghost'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setParams([{ name: 'view', value: view.key }])}
                >
                  {view.label}
                </Button>
              ))}
            </div>
          </div>

          <TabSelector
            tabs={TAB_CONFIG}
            activeTab={currentTab}
            onTabChange={(tab) => setParams([{ name: 'tab', value: tab }])}
            className="mb-4 flex-shrink-0"
          />

          {/* Main Layout Area */}
          <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
            <div className={cn('relative flex-1 flex flex-col min-w-0 border rounded-lg overflow-hidden', currentView === 'agenda' && 'border-0')}>
              {currentView === 'agenda' ? (
                <AgendaView isLoading={isLoading} agendaGroups={agendaGroups} onAppointmentClick={handleAppointmentClick} selectedDate={selectedDate} />
              ) : (
                <>
                  {isLoading && <CalendarGridSkeleton />}
                  <CalendarContext.Provider value={calendarCtx}>
                    <DnDCalendar
                      localizer={localizer}
                      events={displayEvents}
                      view={rbcView}
                      onView={() => { }}
                      date={selectedDate}
                      onNavigate={() => { }}
                      step={30}
                      timeslots={2}
                      min={MIN_TIME}
                      max={MAX_TIME}
                      scrollToTime={SCROLL_TO_TIME}
                      selectable
                      resizable
                      onEventDrop={handleEventDrop}
                      onEventResize={handleEventResize}
                      onSelectEvent={handleSelectEvent}
                      onSelectSlot={handleSelectSlot}
                      components={components}
                      eventPropGetter={eventPropGetter}
                      style={{ height: '100%' }}
                      formats={{ timeGutterFormat: 'h a' }}
                      views={[Views.MONTH, Views.WEEK, Views.WORK_WEEK, Views.DAY]}
                    />
                  </CalendarContext.Provider>
                </>
              )}
            </div>

            {/* Right Sidebar */}
            {currentView !== 'agenda' && (
              <div className="w-80 flex flex-col flex-shrink-0 rounded-lg p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h4 className="text-b14-600">{format(selectedDate, 'd MMM, yyyy')}</h4>
                  {currentTab === 'appointment' && (
                    <Button LeftIcon={Plus} onClick={() => setIsFormModalOpen(true)} size="sm" className="text-primary" variant="ghost">Add</Button>
                  )}
                </div>
                {currentTab === 'appointment' ? (
                  <AppointmentList appointments={selectedDateItems} onAppointmentClick={handleAppointmentClick} isLoading={isLoading} />
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {selectedDateItems.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">No events</div>
                    ) : selectedDateItems.map((evt: any) => (
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

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          isOpen={isDetailModalOpen}
          onClose={() => { setIsDetailModalOpen(false); setSelectedAppointment(null); }}
          onEdit={(apt) => { setEditingAppointment(apt); setIsDetailModalOpen(false); setIsFormModalOpen(true); }}
          onDelete={() => { setIsDetailModalOpen(false); setSelectedAppointment(null); }}
        />
      )}
      <AppointmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingAppointment(null); setPrefilledDate(undefined); setPrefilledEndDate(undefined); }}
        appointment={editingAppointment}
        selectedDate={prefilledDate ?? selectedDate}
        selectedEndDate={prefilledEndDate}
      />
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================
const AgendaCard = ({ item, onClick }: { item: IAppointment; onClick: () => void }) => (
  <div className="flex items-start gap-4 px-1 py-4 border-gray-200 cursor-pointer border-b last:border-b-0" onClick={onClick}>
    <div className={`w-1 ${getAppointColorBasedOnUserName(item.user?.firstName || '', item.user?.lastName || '')} rounded-full flex-shrink-0 self-stretch`} />
    <div className="flex-shrink-0 text-sm font-medium text-neutral-black min-w-[148px] flex items-center gap-2 mr-8">
      <Clock className="h-4 w-4" /> {format(parseISO(item.startTime), 'h:mm a')} - {format(parseISO(item.endTime), 'h:mm a')}
    </div>
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

const AppointmentPopover = ({ setEditingAppointment, apt, children }: { setEditingAppointment: (appointment: any) => void; apt: any; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutateAsync: deleteAppointment } = useDeleteAppointment();

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

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent align="start" className="min-w-[504px]" onClick={e => e.stopPropagation()}>
          <AppointmentPreview
            appointment={apt}
            onEdit={() => { setEditingAppointment(apt); setIsOpen(false); }}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onClose={() => setIsOpen(false)}
          />
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
