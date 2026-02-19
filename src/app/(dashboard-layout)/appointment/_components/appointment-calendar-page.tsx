'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, getHours, getMinutes, differenceInMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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

const AppointmentCalendarPage = () => {
  const { getSearchParamsObject, searchParams, setParams } = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<IAppointment | null>(null);

  const currentView = searchParams.get('view') || 'month';
  const currentTab = searchParams.get('tab') || 'appointment';
  const userId = searchParams.get('userId') || undefined;

  const { ...filterParams } = getSearchParamsObject(APPOINTMENT_FILTER_PARAMS);

  // Calculate date range based on view
  const getDateRange = () => {
    const date = selectedDate;
    switch (currentView) {
      case 'week':
        return {
          from: format(startOfWeek(date), 'yyyy-MM-dd'),
          to: format(endOfWeek(date), 'yyyy-MM-dd'),
        };
      case 'work-week':
        const workWeekStart = startOfWeek(date, { weekStartsOn: 1 });
        const workWeekEnd = addDays(workWeekStart, 4);
        return {
          from: format(workWeekStart, 'yyyy-MM-dd'),
          to: format(workWeekEnd, 'yyyy-MM-dd'),
        };
      case 'day':
        return {
          from: format(date, 'yyyy-MM-dd'),
          to: format(date, 'yyyy-MM-dd'),
        };
      case 'agenda':
        // Show 30 days from selected date
        return {
          from: format(date, 'yyyy-MM-dd'),
          to: format(addDays(date, 30), 'yyyy-MM-dd'),
        };
      case 'month':
      default:
        return {
          from: format(startOfMonth(date), 'yyyy-MM-dd'),
          to: format(endOfMonth(date), 'yyyy-MM-dd'),
        };
    }
  };

  const dateRange = getDateRange();

  const { data, isLoading } = useGetAppointments({
    ...filterParams,
    ...dateRange,
    userId: userId,
    view: currentView as 'month' | 'week' | 'work-week' | 'day' | 'agenda',
  });

  const { data: calendarData, isLoading: isCalendarLoading } = useGetCalendar({
    ...getSearchParamsObject(CALENDAR_FILTER_PARAMS),
    ...dateRange,
    userId: userId,
    view: currentView as 'month' | 'week' | 'work-week' | 'day' | 'agenda',
  });

  const appointments = data?.rows || [];
  const calendarEvents = calendarData?.rows || [];

  const handleViewChange = (view: string) => {
    setParams([{ name: 'view', value: view }]);
  };

  const handleTabChange = (tab: string) => {
    setParams([{ name: 'tab', value: tab }]);
  };

  const handleDateChange = (direction: 'prev' | 'next' | 'today') => {
    let newDate = selectedDate;
    switch (direction) {
      case 'prev':
        if (currentView === 'month') {
          newDate = addDays(startOfMonth(selectedDate), -1);
        } else if (currentView === 'week') {
          const weekStart = startOfWeek(selectedDate);
          newDate = addDays(weekStart, -7);
        } else if (currentView === 'work-week') {
          const workWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
          newDate = addDays(workWeekStart, -7);
        } else if (currentView === 'agenda') {
          newDate = addDays(selectedDate, -30);
        } else {
          newDate = addDays(selectedDate, -1);
        }
        break;
      case 'next':
        if (currentView === 'month') {
          newDate = addDays(endOfMonth(selectedDate), 1);
        } else if (currentView === 'week') {
          const weekStart = startOfWeek(selectedDate);
          newDate = addDays(weekStart, 7);
        } else if (currentView === 'work-week') {
          const workWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
          newDate = addDays(workWeekStart, 7);
        } else if (currentView === 'agenda') {
          newDate = addDays(selectedDate, 30);
        } else {
          newDate = addDays(selectedDate, 1);
        }
        break;
      case 'today':
        newDate = new Date();
        break;
    }
    setSelectedDate(newDate);
  };

  const handleAppointmentClick = useCallback((appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  }, []);

  const handleAddClick = () => {
    setEditingAppointment(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (appointment: IAppointment) => {
    setEditingAppointment(appointment);
    setIsDetailModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDetailModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setEditingAppointment(null);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedAppointment(null);
  };

  // Get appointments for selected date
  const selectedDateAppointments = appointments.filter((apt) => {
    const aptDate = format(parseISO(apt.date), 'yyyy-MM-dd');
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return aptDate === selectedDateStr;
  });

  // Get calendar events for selected date
  const selectedDateEvents = calendarEvents.filter((evt) => {
    const evtDate = format(parseISO(evt.date), 'yyyy-MM-dd');
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return evtDate === selectedDateStr;
  });

  // Group appointments by date for calendar view
  const appointmentsByDate = appointments.reduce((acc, apt) => {
    const dateKey = format(parseISO(apt.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, IAppointment[]>);

  // Group calendar events by date
  const eventsByDate = calendarEvents.reduce((acc, evt) => {
    const dateKey = format(parseISO(evt.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(evt as IAppointment);
    return acc;
  }, {} as Record<string, IAppointment[]>);

  // Generate calendar days for month view
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  // Generate week days for week/work-week view
  const weekDays = useMemo(() => {
    const weekStart = currentView === 'work-week'
      ? startOfWeek(selectedDate, { weekStartsOn: 1 })
      : startOfWeek(selectedDate);
    const days: Date[] = [];
    const dayCount = currentView === 'work-week' ? 5 : 7;
    for (let i = 0; i < dayCount; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [selectedDate, currentView]);

  // Generate time slots (All day + 8 AM to 8 PM)
  const timeSlots = useMemo(() => {
    const slots: { hour: number | null; label: string; isAllDay?: boolean }[] = [
      { hour: null, label: 'All day', isAllDay: true },
    ];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push({
        hour,
        label: format(new Date().setHours(hour, 0, 0, 0), 'h a'),
      });
    }
    return slots;
  }, []);

  // Get current time position for day view
  const getCurrentTimePosition = useMemo(() => {
    if (currentView !== 'day') return null;
    const now = new Date();
    const currentHour = getHours(now);
    const currentMin = getMinutes(now);

    // Only show if within the visible time range (8 AM - 8 PM)
    if (currentHour < 8 || currentHour > 20) return null;

    const startMinutes = (currentHour - 8) * 60 + currentMin;
    const totalMinutesInDay = 12 * 60; // 12 hours (8 AM to 8 PM)
    const topPercent = (startMinutes / totalMinutesInDay) * 100;

    return {
      top: `${topPercent}%`,
      time: format(now, 'h:mm a'),
    };
  }, [currentView]);

  // Calculate appointment position and height
  const getAppointmentPosition = (appointment: IAppointment, dayDate: Date) => {
    const startTime = parseISO(appointment.startTime);
    const endTime = parseISO(appointment.endTime);
    const appointmentDate = format(startTime, 'yyyy-MM-dd');
    const dayKey = format(dayDate, 'yyyy-MM-dd');

    // Check if appointment belongs to this day
    if (appointmentDate !== dayKey) {
      return null;
    }

    const startHour = getHours(startTime);
    const startMin = getMinutes(startTime);
    const endHour = getHours(endTime);
    const endMin = getMinutes(endTime);

    // Calculate top position (percentage from 8 AM)
    // Time slots are from 8 AM (hour 8) to 8 PM (hour 20), which is 12 hours
    const startMinutes = (startHour - 8) * 60 + startMin;
    const totalMinutesInDay = 12 * 60; // 12 hours (8 AM to 8 PM)
    const topPercent = Math.max(0, (startMinutes / totalMinutesInDay) * 100);

    // Calculate height
    const durationMinutes = differenceInMinutes(endTime, startTime);
    const heightPercent = Math.min(100, (durationMinutes / totalMinutesInDay) * 100);

    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
      startTime,
      endTime,
    };
  };

  // Get appointments for a specific day
  const getDayAppointments = (dayDate: Date) => {
    const dayKey = format(dayDate, 'yyyy-MM-dd');
    return appointments.filter((apt) => {
      const aptDate = format(parseISO(apt.startTime), 'yyyy-MM-dd');
      return aptDate === dayKey;
    });
  };

  // Get appointment color
  const getAppointmentColor = (type?: string) => {
    switch (type) {
      case 'online':
        return { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' };
      case 'phone':
        return { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
      default:
        return { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
    }
  };

  // Get user initials
  const getUserInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  // Group appointments by date for agenda view
  const appointmentsByDateForAgenda = useMemo(() => {
    const grouped: Record<string, IAppointment[]> = {};
    appointments.forEach((apt) => {
      const dateKey = format(parseISO(apt.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(apt);
    });

    // Sort dates and appointments within each date
    const sortedDates = Object.keys(grouped).sort();
    const result: Array<{ date: string; appointments: IAppointment[] }> = [];

    sortedDates.forEach((dateKey) => {
      const dayAppointments = grouped[dateKey].sort((a, b) => {
        const timeA = parseISO(a.startTime);
        const timeB = parseISO(b.startTime);
        return timeA.getTime() - timeB.getTime();
      });
      result.push({ date: dateKey, appointments: dayAppointments });
    });

    return result;
  }, [appointments]);

  // Group calendar events by date for agenda view
  const eventsByDateForAgenda = useMemo(() => {
    const grouped: Record<string, IAppointment[]> = {};
    calendarEvents.forEach((evt) => {
      const dateKey = format(parseISO(evt.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(evt as IAppointment);
    });

    // Sort dates and events within each date
    const sortedDates = Object.keys(grouped).sort();
    const result: Array<{ date: string; events: IAppointment[] }> = [];

    sortedDates.forEach((dateKey) => {
      const dayEvents = grouped[dateKey].sort((a, b) => {
        const timeA = parseISO(a.startTime);
        const timeB = parseISO(b.startTime);
        return timeA.getTime() - timeB.getTime();
      });
      result.push({ date: dateKey, events: dayEvents });
    });

    return result;
  }, [calendarEvents]);

  return (
    <div className="flex flex-col h-[calc(100vh-66px)] max-h-[calc(100vh-66px)] overflow-hidden">
      <Portal rootId={PortalIds.DashboardHeader}>
        <h3 className="text-h5 text-content-heading font-bold">Appointment calendar</h3>
      </Portal>

      <Container className="flex flex-col flex-1 min-h-0 overflow-hidden !p-6">
        <div className="flex flex-col h-full bg-white rounded-lg p-4 overflow-hidden flex-1 min-h-0">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => handleDateChange('today')}>
                Today
              </Button>

              <div className="flex items-center gap-2 border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleDateChange('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {currentView === 'week' || currentView === 'work-week'
                    ? `${format(weekDays[0], 'd MMM')} - ${format(weekDays[weekDays.length - 1], 'd MMM, yyyy')}`
                    : currentView === 'agenda'
                      ? `${format(selectedDate, 'd MMM, yyyy')} - ${format(addDays(selectedDate, 30), 'd MMM, yyyy')}`
                      : format(selectedDate, 'd MMM, yyyy')}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleDateChange('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md px-2 py-1.5">User: All selected</div>
            </div>
            <div className="flex items-center rounded-3xl p-1 bg-[#F7F8FA] border border-light-grey">
              {VIEW_OPTIONS.map((view) => (
                <Button
                  key={view.key}
                  variant={currentView === view.key ? 'primary' : 'ghost'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleViewChange(view.key)}
                >
                  {view.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex-shrink-0">
            <TabSelector tabs={TAB_CONFIG} activeTab={currentTab} onTabChange={handleTabChange} />
          </div>

          {/* Main Content - Flex layout for full height */}
          {currentTab === 'appointment' && (
            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
              {/* Calendar View - Takes full height, no scrollbar */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
                  {/* Day View */}
                  {currentView === 'day' ? (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      {/* Day Header */}
                      <div className="grid gap-px bg-gray-200 border-b flex-shrink-0" style={{ gridTemplateColumns: '80px 1fr' }}>
                        <div className="bg-white p-2"></div>
                        <div className="bg-white p-2 text-center">
                          <div className="text-xs text-gray-500 font-medium">
                            {format(selectedDate, 'EEEE')}
                          </div>
                          <div className={`text-lg font-semibold ${isSameDay(selectedDate, new Date()) ? 'text-blue-600' : ''}`}>
                            {format(selectedDate, 'd MMM, yyyy')}
                          </div>
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div className="flex-1 overflow-y-auto relative">
                        <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: '80px 1fr' }}>
                          {/* Time Column */}
                          <div className="bg-white">
                            {timeSlots.map((slot, idx) => (
                              <div
                                key={slot.hour ?? `all-day-${idx}`}
                                className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 px-2 text-xs text-gray-500 flex items-start pt-1`}
                              >
                                {slot.label}
                              </div>
                            ))}
                          </div>

                          {/* Day Column */}
                          <div className="bg-white relative">
                            {/* Time slot cells */}
                            {timeSlots.map((slot, idx) => (
                              <div
                                key={slot.hour ?? `all-day-${idx}`}
                                className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                                onClick={() => {
                                  if (!slot.isAllDay && slot.hour !== null) {
                                    const newDate = new Date(selectedDate);
                                    newDate.setHours(slot.hour, 0, 0, 0);
                                    setSelectedDate(newDate);
                                  }
                                }}
                              />
                            ))}

                            {/* Current Time Indicator */}
                            {getCurrentTimePosition && (
                              <div
                                className="absolute left-0 right-0 z-20 pointer-events-none"
                                style={{ top: getCurrentTimePosition.top }}
                              >
                                <div className="flex items-center">
                                  <div className="text-xs text-red-600 font-medium px-2 bg-white">
                                    {getCurrentTimePosition.time}
                                  </div>
                                  <div className="flex-1 h-0.5 bg-red-500"></div>
                                </div>
                              </div>
                            )}

                            {/* Appointments */}
                            {getDayAppointments(selectedDate).map((apt) => {
                              const position = getAppointmentPosition(apt, selectedDate);
                              if (!position) return null;

                              const colors = getAppointmentColor(apt.type);
                              return (
                                <div
                                  key={apt.id}
                                  className={`absolute left-1 right-1 ${colors.light} ${colors.text} border-l-4 ${colors.bg} rounded-r px-2 py-1 cursor-pointer hover:opacity-90 shadow-sm z-10`}
                                  style={{
                                    top: position.top,
                                    height: position.height,
                                    minHeight: '24px',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(apt);
                                  }}
                                >
                                  <div className="text-xs font-medium truncate">
                                    {format(position.startTime, 'h:mm a')} - {format(position.endTime, 'h:mm a')}
                                  </div>
                                  <div className="text-xs font-semibold truncate mt-0.5">
                                    {apt.title}
                                  </div>
                                  {apt.description && (
                                    <div className="text-xs text-gray-600 truncate mt-0.5">
                                      {apt.description}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (currentView === 'week' || currentView === 'work-week') ? (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      {/* Day Headers */}
                      <div className={`grid gap-px bg-gray-200 border-b flex-shrink-0`} style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
                        <div className="bg-white p-2"></div>
                        {weekDays.map((day) => {
                          const isSelected = isSameDay(day, selectedDate);
                          const isToday = isSameDay(day, new Date());
                          return (
                            <div
                              key={day.toString()}
                              className={`bg-white p-2 text-center cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-b-2 border-blue-500' : ''
                                }`}
                              onClick={() => setSelectedDate(day)}
                            >
                              <div className="text-xs text-gray-500 font-medium">
                                {format(day, 'EEE')}
                              </div>
                              <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                                {format(day, 'd')}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Time Slots Grid */}
                      <div className="flex-1 overflow-y-auto">
                        <div className={`grid gap-px bg-gray-200`} style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
                          {/* Time Column */}
                          <div className="bg-white">
                            {timeSlots.map((slot, idx) => (
                              <div
                                key={slot.hour ?? `all-day-${idx}`}
                                className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 px-2 text-xs text-gray-500 flex items-start pt-1`}
                              >
                                {slot.label}
                              </div>
                            ))}
                          </div>

                          {/* Day Columns */}
                          {weekDays.map((day) => {
                            const dayAppointments = getDayAppointments(day);
                            return (
                              <div key={day.toString()} className="bg-white relative">
                                {timeSlots.map((slot, idx) => (
                                  <div
                                    key={slot.hour ?? `all-day-${idx}`}
                                    className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                                    onClick={() => setSelectedDate(day)}
                                  />
                                ))}

                                {/* Appointments */}
                                {dayAppointments.map((apt) => {
                                  const position = getAppointmentPosition(apt, day);
                                  if (!position) return null;

                                  const colors = getAppointmentColor(apt.type);
                                  return (
                                    <div
                                      key={apt.id}
                                      className={`absolute left-0 right-0 ${colors.light} ${colors.text} border-l-4 ${colors.bg} rounded-r px-2 py-1 cursor-pointer hover:opacity-90 shadow-sm z-10`}
                                      style={{
                                        top: position.top,
                                        height: position.height,
                                        minHeight: '24px',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAppointmentClick(apt);
                                      }}
                                    >
                                      <div className="text-xs font-medium truncate">
                                        {format(position.startTime, 'h:mm a')} - {format(position.endTime, 'h:mm a')}
                                      </div>
                                      <div className="text-xs font-semibold truncate mt-0.5">
                                        {apt.title}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : currentView === 'agenda' ? (
                    /* Agenda View */
                    <div className="flex-1 overflow-y-auto bg-white">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-gray-500">Loading appointments...</div>
                        </div>
                      ) : appointmentsByDateForAgenda.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-gray-500">No appointments found</div>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {appointmentsByDateForAgenda.map(({ date, appointments }) => {
                            const dateObj = parseISO(date);
                            const isToday = isSameDay(dateObj, new Date());

                            return (
                              <div key={date} className="py-4">
                                {/* Date Header */}
                                <div className="flex items-center justify-between px-6 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                      {format(dateObj, 'MMM d, yyyy')} - {format(dateObj, 'EEEE')}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
                                  </div>
                                </div>

                                {/* Appointments List */}
                                <div className="space-y-2 px-6">
                                  {appointments.map((apt) => {
                                    const colors = getAppointmentColor(apt.type);
                                    const startTime = parseISO(apt.startTime);
                                    const endTime = parseISO(apt.endTime);
                                    const ownerInitials = getUserInitials(apt.owner?.firstName, apt.owner?.lastName);

                                    return (
                                      <div
                                        key={apt.id}
                                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => handleAppointmentClick(apt)}
                                      >
                                        {/* Time Block */}
                                        <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">
                                          {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                                        </div>

                                        {/* Colored Vertical Bar */}
                                        <div className={`w-1 ${colors.bg} rounded-full flex-shrink-0`} />

                                        {/* Appointment Details */}
                                        <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-gray-900 mb-1">
                                            {apt.title}
                                          </div>
                                          {apt.description && (
                                            <div className="text-sm text-gray-600 mb-2">
                                              {apt.description}
                                            </div>
                                          )}
                                          {apt.client && (
                                            <div className="text-sm text-gray-500">
                                              {apt.client.firstName} {apt.client.lastName}
                                              {apt.client.email && ` | ${apt.client.email}`}
                                              {apt.client.phone && ` | ${apt.client.phone}`}
                                            </div>
                                          )}
                                        </div>

                                        {/* Assigned User */}
                                        {apt.owner && (
                                          <div className="flex-shrink-0 flex items-center gap-2">
                                            <div className="text-sm text-gray-700 font-medium">
                                              {apt.owner.firstName} {apt.owner.lastName}
                                            </div>
                                            <div className={`w-8 h-8 rounded-full ${colors.light} ${colors.text} flex items-center justify-center text-xs font-semibold ${colors.border} border-2`}>
                                              {ownerInitials}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Month View */
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="grid grid-cols-7 flex-shrink-0 bg-[#F9FAFB]">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                          <div key={day} className="text-center text-sm font-medium border py-3 border-neutral-border-light">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 auto-rows-fr flex-1 min-h-0 !pt-0">
                        {calendarDays.map((day, idx) => {
                          const dayKey = format(day, 'yyyy-MM-dd');
                          const dayAppointments = appointmentsByDate[dayKey] || [];
                          const isCurrentMonth = isSameMonth(day, selectedDate);
                          const isSelected = isSameDay(day, selectedDate);
                          const isToday = isSameDay(day, new Date());

                          const getAppointmentColorClass = (type?: string) => {
                            switch (type) {
                              case 'online':
                                return 'bg-green-500';
                              case 'phone':
                                return 'bg-yellow-500';
                              default:
                                return 'bg-blue-500';
                            }
                          };

                          return (
                            <div
                              key={idx}
                              className={cn(`flex flex-col border p-2 !pl-[10px] cursor-pointer hover:bg-gray-50`, !isCurrentMonth ? 'opacity-40' : '', isSelected && 'border-primary-blue')}
                              onClick={() => setSelectedDate(day)}
                            >
                              <div className={cn(`text-sm mb-1.5 flex-shrink-0`)}>
                                <span className={isToday ? 'font-bold text-white bg-primary-blue p-1.5 rounded-md' : ''}>
                                  {format(day, 'd')}
                                </span>
                              </div>
                              <div className="flex-1 space-y-1 overflow-hidden min-h-0">
                                {dayAppointments.slice(0, 2).map((apt) => (
                                  <AppointmentPopover apt={apt}>
                                    <div
                                      key={apt.id}
                                      className={cn("text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-[#F7F8FA]")}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getAppointmentColorClass(apt.type)}`} />
                                      <span className="truncate">
                                        {format(parseISO(apt.startTime), 'h:mma')} {apt.title.substring(0, 12)}...
                                      </span>
                                    </div>

                                  </AppointmentPopover>
                                ))}
                                {dayAppointments.length > 2 && (
                                  <div className="text-xs text-gray-500 mt-1 px-1">{dayAppointments.length - 2} more</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment List - Fixed width with scrollbar */}
              <div className="w-80 flex flex-col flex-shrink-0 border rounded-lg p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h4 className="text-lg font-semibold">{format(selectedDate, 'd MMM, yyyy')}</h4>
                  <Button LeftIcon={Plus} onClick={handleAddClick} size="sm">
                    Add
                  </Button>
                </div>
                <AppointmentList
                  appointments={selectedDateAppointments}
                  onAppointmentClick={handleAppointmentClick}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {currentTab === 'calendar' && (
            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
              {/* Calendar View - Takes full height, no scrollbar */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
                  {/* Day View */}
                  {currentView === 'day' ? (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      {/* Day Header */}
                      <div className="grid gap-px bg-gray-200 border-b flex-shrink-0" style={{ gridTemplateColumns: '80px 1fr' }}>
                        <div className="bg-white p-2"></div>
                        <div className="bg-white p-2 text-center">
                          <div className="text-xs text-gray-500 font-medium">
                            {format(selectedDate, 'EEEE')}
                          </div>
                          <div className={`text-lg font-semibold ${isSameDay(selectedDate, new Date()) ? 'text-blue-600' : ''}`}>
                            {format(selectedDate, 'd MMM, yyyy')}
                          </div>
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div className="flex-1 overflow-y-auto relative">
                        <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: '80px 1fr' }}>
                          {/* Time Column */}
                          <div className="bg-white">
                            {timeSlots.map((slot, idx) => (
                              <div
                                key={slot.hour ?? `all-day-${idx}`}
                                className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 px-2 text-xs text-gray-500 flex items-start pt-1`}
                              >
                                {slot.label}
                              </div>
                            ))}
                          </div>

                          {/* Day Column */}
                          <div className="bg-white relative">
                            {/* Time slot cells */}
                            {timeSlots.map((slot, idx) => (
                              <div
                                key={slot.hour ?? `all-day-${idx}`}
                                className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                                onClick={() => {
                                  if (!slot.isAllDay && slot.hour !== null) {
                                    const newDate = new Date(selectedDate);
                                    newDate.setHours(slot.hour, 0, 0, 0);
                                    setSelectedDate(newDate);
                                  }
                                }}
                              />
                            ))}

                            {/* Current Time Indicator */}
                            {getCurrentTimePosition && (
                              <div
                                className="absolute left-0 right-0 z-20 pointer-events-none"
                                style={{ top: getCurrentTimePosition.top }}
                              >
                                <div className="flex items-center">
                                  <div className="text-xs text-red-600 font-medium px-2 bg-white">
                                    {getCurrentTimePosition.time}
                                  </div>
                                  <div className="flex-1 h-0.5 bg-red-500"></div>
                                </div>
                              </div>
                            )}

                            {/* Calendar Events */}
                            {getDayAppointments(selectedDate).map((evt) => {
                              const position = getAppointmentPosition(evt, selectedDate);
                              if (!position) return null;

                              const colors = getAppointmentColor(evt.type);
                              return (
                                <div
                                  key={evt.id}
                                  className={`absolute left-1 right-1 ${colors.light} ${colors.text} border-l-4 ${colors.bg} rounded-r px-2 py-1 cursor-pointer hover:opacity-90 shadow-sm z-10`}
                                  style={{
                                    top: position.top,
                                    height: position.height,
                                    minHeight: '24px',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(evt);
                                  }}
                                >
                                  <div className="text-xs font-medium truncate">
                                    {format(position.startTime, 'h:mm a')} - {format(position.endTime, 'h:mm a')}
                                  </div>
                                  <div className="text-xs font-semibold truncate mt-0.5">
                                    {evt.title}
                                  </div>
                                  {evt.description && (
                                    <div className="text-xs text-gray-600 truncate mt-0.5">
                                      {evt.description}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (currentView === 'week' || currentView === 'work-week') ? (
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      {/* Day Headers */}
                      <div className={`grid gap-px bg-gray-200 border-b flex-shrink-0`} style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
                        <div className="bg-white p-2"></div>
                        {weekDays.map((day) => {
                          const isSelected = isSameDay(day, selectedDate);
                          const isToday = isSameDay(day, new Date());
                          return (
                            <div
                              key={day.toString()}
                              className={`bg-white p-2 text-center cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-b-2 border-blue-500' : ''
                                }`}
                              onClick={() => setSelectedDate(day)}
                            >
                              <div className="text-xs text-gray-500 font-medium">
                                {format(day, 'EEE')}
                              </div>
                              <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                                {format(day, 'd')}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Time Slots Grid */}
                      <div className="flex-1 overflow-y-auto">
                        <div className={`grid gap-px bg-gray-200`} style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}>
                          {/* Time Column */}
                          <div className="bg-white">
                            {timeSlots.map((slot, idx) => (
                              <div
                                key={slot.hour ?? `all-day-${idx}`}
                                className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 px-2 text-xs text-gray-500 flex items-start pt-1`}
                              >
                                {slot.label}
                              </div>
                            ))}
                          </div>

                          {/* Day Columns */}
                          {weekDays.map((day) => {
                            const dayEvents = getDayAppointments(day);
                            return (
                              <div key={day.toString()} className="bg-white relative">
                                {timeSlots.map((slot, idx) => (
                                  <div
                                    key={slot.hour ?? `all-day-${idx}`}
                                    className={`${slot.isAllDay ? 'h-12' : 'h-16'} border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}
                                    onClick={() => setSelectedDate(day)}
                                  />
                                ))}

                                {/* Calendar Events */}
                                {dayEvents.map((evt) => {
                                  const position = getAppointmentPosition(evt, day);
                                  if (!position) return null;

                                  const colors = getAppointmentColor(evt.type);
                                  return (
                                    <div
                                      key={evt.id}
                                      className={`absolute left-0 right-0 ${colors.light} ${colors.text} border-l-4 ${colors.bg} rounded-r px-2 py-1 cursor-pointer hover:opacity-90 shadow-sm z-10`}
                                      style={{
                                        top: position.top,
                                        height: position.height,
                                        minHeight: '24px',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAppointmentClick(evt);
                                      }}
                                    >
                                      <div className="text-xs font-medium truncate">
                                        {format(position.startTime, 'h:mm a')} - {format(position.endTime, 'h:mm a')}
                                      </div>
                                      <div className="text-xs font-semibold truncate mt-0.5">
                                        {evt.title}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : currentView === 'agenda' ? (
                    /* Agenda View */
                    <div className="flex-1 overflow-y-auto bg-white">
                      {isCalendarLoading ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-gray-500">Loading calendar events...</div>
                        </div>
                      ) : eventsByDateForAgenda.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-gray-500">No calendar events found</div>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {eventsByDateForAgenda.map(({ date, events }) => {
                            const dateObj = parseISO(date);
                            const isToday = isSameDay(dateObj, new Date());

                            return (
                              <div key={date} className="py-4">
                                {/* Date Header */}
                                <div className="flex items-center justify-between px-6 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                      {format(dateObj, 'MMM d, yyyy')} - {format(dateObj, 'EEEE')}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {events.length} {events.length === 1 ? 'event' : 'events'}
                                  </div>
                                </div>

                                {/* Events List */}
                                <div className="space-y-2 px-6">
                                  {events.map((evt) => {
                                    const colors = getAppointmentColor(evt.type);
                                    const startTime = parseISO(evt.startTime);
                                    const endTime = parseISO(evt.endTime);
                                    const ownerInitials = getUserInitials(evt.owner?.firstName, evt.owner?.lastName);

                                    return (
                                      <div
                                        key={evt.id}
                                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => handleAppointmentClick(evt)}
                                      >
                                        {/* Time Block */}
                                        <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">
                                          {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                                        </div>

                                        {/* Colored Vertical Bar */}
                                        <div className={`w-1 ${colors.bg} rounded-full flex-shrink-0`} />

                                        {/* Event Details */}
                                        <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-gray-900 mb-1">
                                            {evt.title}
                                          </div>
                                          {evt.description && (
                                            <div className="text-sm text-gray-600 mb-2">
                                              {evt.description}
                                            </div>
                                          )}
                                          {evt.client && (
                                            <div className="text-sm text-gray-500">
                                              {evt.client.firstName} {evt.client.lastName}
                                              {evt.client.email && ` | ${evt.client.email}`}
                                              {evt.client.phone && ` | ${evt.client.phone}`}
                                            </div>
                                          )}
                                        </div>

                                        {/* Assigned User */}
                                        {evt.owner && (
                                          <div className="flex-shrink-0 flex items-center gap-2">
                                            <div className="text-sm text-gray-700 font-medium">
                                              {evt.owner.firstName} {evt.owner.lastName}
                                            </div>
                                            <div className={`w-8 h-8 rounded-full ${colors.light} ${colors.text} flex items-center justify-center text-xs font-semibold ${colors.border} border-2`}>
                                              {ownerInitials}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Month View */
                    <div className="flex-1 flex flex-col p-4 overflow-hidden">
                      <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 auto-rows-fr gap-1 flex-1 min-h-0">
                        {calendarDays.map((day, idx) => {
                          const dayKey = format(day, 'yyyy-MM-dd');
                          const dayEvents = eventsByDate[dayKey] || [];
                          const isCurrentMonth = isSameMonth(day, selectedDate);
                          const isSelected = isSameDay(day, selectedDate);
                          const isToday = isSameDay(day, new Date());

                          const getAppointmentColorClass = (type?: string) => {
                            switch (type) {
                              case 'online':
                                return 'bg-green-500';
                              case 'phone':
                                return 'bg-yellow-500';
                              default:
                                return 'bg-blue-500';
                            }
                          };

                          return (
                            <div
                              key={idx}
                              className={`flex flex-col border rounded p-1.5 cursor-pointer hover:bg-gray-50 ${!isCurrentMonth ? 'opacity-40' : ''
                                } ${isSelected ? 'bg-blue-100 border-blue-500' : ''} ${isToday ? 'border-blue-300' : ''}`}
                              onClick={() => setSelectedDate(day)}
                            >
                              <div className={`text-sm mb-1.5 flex-shrink-0 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                                {format(day, 'd')}
                              </div>
                              <div className="flex-1 space-y-1 overflow-hidden min-h-0">
                                {dayEvents.slice(0, 2).map((evt) => (
                                  <div
                                    key={evt.id}
                                    className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1.5"
                                    style={{ backgroundColor: evt.type === 'online' ? '#d1fae5' : evt.type === 'phone' ? '#fef3c7' : '#dbeafe' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAppointmentClick(evt);
                                    }}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getAppointmentColorClass(evt.type)}`} />
                                    <span className="truncate text-gray-700">
                                      {format(parseISO(evt.startTime), 'h:mma')} {evt.title.substring(0, 12)}...
                                    </span>
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500 mt-1 px-1">{dayEvents.length - 2} more</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Calendar Event List - Fixed width with scrollbar */}
              <div className="w-80 flex flex-col flex-shrink-0 border rounded-lg p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h4 className="text-lg font-semibold">{format(selectedDate, 'd MMM, yyyy')}</h4>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No events for this date
                    </div>
                  ) : (
                    selectedDateEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAppointmentClick(evt as IAppointment)}
                      >
                        <div className="font-semibold text-sm text-gray-900">{evt.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {format(parseISO(evt.startTime), 'h:mm a')} - {format(parseISO(evt.endTime), 'h:mm a')}
                        </div>
                        {evt.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{evt.description}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Modals */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          isOpen={isDetailModalOpen}
          onClose={handleDetailClose}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <AppointmentFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormClose}
        appointment={editingAppointment}
        selectedDate={selectedDate}
      />
    </div>
  );
};

const AppointmentPopover = ({ apt, children }: { apt: any, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align='start' className="min-w-[504px]">
        <AppointmentPreview appointment={apt} onEdit={() => { }} onDelete={() => { }} onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};

export default AppointmentCalendarPage;
