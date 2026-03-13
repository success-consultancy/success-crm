import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, parseISO } from 'date-fns';
import { APPOINTMENT_FILTER_PARAMS, useGetAppointments } from '@/query/get-appointments';
import { CALENDAR_FILTER_PARAMS, useGetCalendar } from '@/query/get-calendar';
import { IAppointment } from '@/types/response-types/appointment-response';
import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';
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
    // Helper: Takes a local date and returns the UTC ISO string 
    // for the EXACT start/end of that day in the specific Timezone.
    const getBoundary = (date: Date, type: 'start' | 'end') => {
      // 1. Get the date string in the target timezone (e.g., "2026-02-22")
      const dateStr = formatInTimeZone(date, timeZone, 'yyyy-MM-dd');

      // 2. Create a string for the boundary
      const timeStr = type === 'start' ? '00:00:00' : '23:59:59.999';

      // 3. Convert that "Wall Clock" time in that TZ back to a UTC Date object
      const zonedDate = fromZonedTime(`${dateStr} ${timeStr}`, timeZone);

      // 4. Return the full ISO string for the API
      return zonedDate.toISOString();
    };

    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);

    switch (currentView) {
      case 'day':
        return {
          from: getBoundary(selectedDate, 'start'), // "2026-02-22T05:00:00.000Z" (if EST)
          to: getBoundary(selectedDate, 'end')      // "2026-02-23T04:59:59.999Z"
        };

      case 'week':

        return {
          from: getBoundary(weekStart, 'start'),
          to: getBoundary(weekEnd, 'end')
        };

      case 'work-week':
        return {
          from: getBoundary(weekStart, 'start'),
          to: getBoundary(weekEnd, 'end')
        };

      case 'month':
        return {
          from: getBoundary(startOfMonth(selectedDate), 'start'),
          to: getBoundary(endOfMonth(selectedDate), 'end')
        };

      default:
        // Fallback for work-week or agenda using similar logic
        return {
          from: getBoundary(selectedDate, 'start'),
          to: getBoundary(addDays(selectedDate, 30), 'end')
        };
    }
  }, [selectedDate, currentView, timeZone]);

  // 2. Fetch Data
  const { data: appointmentData, isLoading: isAptLoading } = useGetAppointments({
    ...getSearchParamsObject(APPOINTMENT_FILTER_PARAMS), ...dateRange, userId, view: currentView as any,
  });

  const { data: calendarData, isLoading: isCalLoading } = useGetCalendar({
    ...getSearchParamsObject(CALENDAR_FILTER_PARAMS), ...dateRange, userId, view: currentView as any,
  });

  const activeItems = useMemo(
    () => currentTab === 'appointment' ? (appointmentData?.rows || []) : (calendarData?.rows || []),
    [currentTab, appointmentData?.rows, calendarData?.rows]
  );
  const isLoading = currentTab === 'appointment' ? isAptLoading : isCalLoading;

  // 3. Generate Calendar Grids
  const timeSlots = useMemo(() => [
    { hour: null, label: 'All day', isAllDay: true },
    ...Array.from({ length: 14 }, (_, i) => ({
      hour: i + 7,
      label: formatInTimeZone(new Date().setHours(i + 7, 0, 0, 0), timeZone, 'h a'), // Apply TZ to labels
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

  // 4. Group Items strictly by Target Timezone
  const itemsByDate = useMemo(() => {
    return activeItems.reduce((acc, item) => {
      // Parse the ISO string (UTC) and format it into the TARGET timezone.
      // This prevents late-night UTC events from shifting into the wrong day locally.
      const dateKey = formatInTimeZone(parseISO(item.date || item.startTime), timeZone, 'yyyy-MM-dd');

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item as IAppointment);
      return acc;
    }, {} as Record<string, IAppointment[]>);
  }, [activeItems, timeZone]);

  // 5. Generate Agenda
  const agendaGroups = useMemo(() => {
    return Object.keys(itemsByDate).sort().map(date => ({
      date,
      items: itemsByDate[date].sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
    }));
  }, [itemsByDate]);

  return { isLoading, timeSlots, weekDays, calendarDays, itemsByDate, agendaGroups, timeZone };
}