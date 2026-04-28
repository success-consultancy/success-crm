import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, parseISO, isWithinInterval } from 'date-fns';
import { APPOINTMENT_FILTER_PARAMS, useGetAppointments } from '@/query/get-appointments';
import { IAppointment } from '@/types/response-types/appointment-response';
import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { useVisaExpiries, VisaExpiryEvent } from './use-visa-expiries';

export type CalendarItem = IAppointment | VisaExpiryEvent;

export function useCalendarData(
  selectedDate: Date,
  currentView: string,
  currentTab: string,
  userId: string | undefined,
  getSearchParamsObject: any,
  // Pass a specific timezone, or default to the user's system timezone to be safe
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) {

  // 1. Calculate API Date Range using strict timezone boundaries
  const dateRange = useMemo(() => {
    const getBoundary = (date: Date, type: 'start' | 'end') => {
      const dateStr = formatInTimeZone(date, timeZone, 'yyyy-MM-dd');
      const timeStr = type === 'start' ? '00:00:00' : '23:59:59.999';
      const zonedDate = fromZonedTime(`${dateStr} ${timeStr}`, timeZone);
      return zonedDate.toISOString();
    };

    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);

    switch (currentView) {
      case 'day':
        return { from: getBoundary(selectedDate, 'start'), to: getBoundary(selectedDate, 'end') };
      case 'week':
      case 'work-week':
        return { from: getBoundary(weekStart, 'start'), to: getBoundary(weekEnd, 'end') };
      case 'month':
        return { from: getBoundary(startOfMonth(selectedDate), 'start'), to: getBoundary(endOfMonth(selectedDate), 'end') };
      default:
        return { from: getBoundary(selectedDate, 'start'), to: getBoundary(addDays(selectedDate, 30), 'end') };
    }
  }, [selectedDate, currentView, timeZone]);

  // 2. Fetch Data
  const { data: appointmentData, isLoading: isAptLoading } = useGetAppointments({
    ...getSearchParamsObject(APPOINTMENT_FILTER_PARAMS), ...dateRange, userId, view: currentView as any,
  });

  // Calendar tab pulls visa expiries from existing entities (no /calendar backend route)
  const { events: visaEvents, isLoading: isCalLoading } = useVisaExpiries(currentTab === 'calendar');

  // Filter visa events to the visible window so we don't render thousands across views
  const visibleVisaEvents = useMemo(() => {
    if (currentTab !== 'calendar') return [];
    const fromDate = parseISO(dateRange.from);
    const toDate = parseISO(dateRange.to);
    return visaEvents.filter((evt) => {
      try {
        const expiryDate = parseISO(evt.visaExpiry);
        return isWithinInterval(expiryDate, { start: fromDate, end: toDate });
      } catch {
        return false;
      }
    });
  }, [currentTab, visaEvents, dateRange.from, dateRange.to]);

  const activeItems: CalendarItem[] = useMemo(
    () => currentTab === 'appointment' ? (appointmentData?.rows || []) : visibleVisaEvents,
    [currentTab, appointmentData?.rows, visibleVisaEvents]
  );
  const isLoading = currentTab === 'appointment' ? isAptLoading : isCalLoading;

  // 3. Calendar Grid metadata
  const timeSlots = useMemo(() => [
    { hour: null, label: 'All day', isAllDay: true },
    ...Array.from({ length: 14 }, (_, i) => ({
      hour: i + 7,
      label: formatInTimeZone(new Date().setHours(i + 7, 0, 0, 0), timeZone, 'h a'),
      isAllDay: false
    }))
  ], [timeZone]);

  const weekDays = useMemo(() => {
    const start = currentView === 'work-week' ? startOfWeek(selectedDate, { weekStartsOn: 1 }) : startOfWeek(selectedDate);
    return Array.from({ length: currentView === 'work-week' ? 5 : 7 }, (_, i) => addDays(start, i));
  }, [selectedDate, currentView]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(selectedDate));
    const end = endOfWeek(endOfMonth(selectedDate));
    const days = [];
    let day = start;
    while (day <= end) { days.push(day); day = addDays(day, 1); }
    return days;
  }, [selectedDate]);

  // 4. Group items by target timezone date
  const itemsByDate = useMemo(() => {
    return activeItems.reduce((acc, item) => {
      const dateSource = (item as any).date || item.startTime || (item as VisaExpiryEvent).visaExpiry;
      const dateKey = formatInTimeZone(parseISO(dateSource), timeZone, 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {} as Record<string, CalendarItem[]>);
  }, [activeItems, timeZone]);

  // 5. Agenda groups
  const agendaGroups = useMemo(() => {
    return Object.keys(itemsByDate).sort().map(date => ({
      date,
      items: itemsByDate[date].sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
    }));
  }, [itemsByDate]);

  return { isLoading, timeSlots, weekDays, calendarDays, itemsByDate, agendaGroups, timeZone, activeItems };
}
