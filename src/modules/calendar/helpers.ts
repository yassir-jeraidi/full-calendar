import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  isSameWeek,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  differenceInMinutes,
  eachDayOfInterval,
  startOfDay,
  differenceInDays,
  isValid,
} from "date-fns";

import type { TCalendarView } from "@/modules/calendar/types";
import type { ICalendarCell, IEvent } from "@/modules/calendar/interfaces";



export function rangeText(view: TCalendarView, date: Date) {
  const formatString = "MMM d, yyyy";
  let start: Date;
  let end: Date;

  switch (view) {
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format(date, formatString);
    default:
      return "Error while formatting ";
  }

  return `${format(start, formatString)} - ${format(end, formatString)}`;
}

export function navigateDate(date: Date, view: TCalendarView, direction: "previous" | "next"): Date {
  const operations = {
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
    year: direction === "next" ? addYears : subYears,
  };

  return operations[view](date, 1);
}

export function getEventsCount(events: IEvent[], date: Date, view: TCalendarView): number {
  const compareFns = {
    day: isSameDay,
    week: isSameWeek,
    month: isSameMonth,
    year: isSameYear,
  };

  return events.filter(event => compareFns[view](new Date(event.startDate), date)).length;
}

export function groupEvents(dayEvents: IEvent[]) {
  const sortedEvents = dayEvents.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
  const groups: IEvent[][] = [];

  for (const event of sortedEvents) {
    const eventStart = parseISO(event.startDate);

    let placed = false;
    for (const group of groups) {
      const lastEventInGroup = group[group.length - 1];
      const lastEventEnd = parseISO(lastEventInGroup.endDate);

      if (eventStart >= lastEventEnd) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([event]);
  }

  return groups;
}

export function getEventBlockStyle(event: IEvent, day: Date, groupIndex: number, groupSize: number) {
  const startDate = parseISO(event.startDate);
  const dayStart = new Date(day.setHours(0, 0, 0, 0));
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(eventStart, dayStart);

  const top = (startMinutes / 1440) * 100;
  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

// ================ Month view helper functions ================ //

export function getCalendarCells(selectedDate: Date): ICalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const nextMonthCells = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth + 1, i + 1),
  }));

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthEventPositions(multiDayEvents: IEvent[], singleDayEvents: IEvent[], selectedDate: Date) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: { [key: string]: number } = {};
  const occupiedPositions: { [key: string]: boolean[] } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach(day => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
      const bDuration = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
      return bDuration - aDuration || parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
    }),
    ...singleDayEvents.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()),
  ];

  sortedEvents.forEach(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const eventDays = eachDayOfInterval({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
          eventDays.every(day => {
            const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
            return dayPositions && !dayPositions[i];
          })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      eventDays.forEach(day => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents(date: Date, events: IEvent[], eventPositions: Record<string, number>) {
  const eventsForDate = events.filter(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return (date >= eventStart && date <= eventEnd) || isSameDay(date, eventStart) || isSameDay(date, eventEnd);
  });

  return eventsForDate
      .map(event => ({
        ...event,
        position: eventPositions[event.id] ?? -1,
        isMultiDay: event.startDate !== event.endDate,
      }))
      .sort((a, b) => {
        if (a.isMultiDay && !b.isMultiDay) return -1;
        if (!a.isMultiDay && b.isMultiDay) return 1;
        return a.position - b.position;
      });
}


export function formatTime(date: Date | string, use24HourFormat: boolean) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  
  if (!isValid(date)) return '';
  
  return format(date, use24HourFormat ? 'HH:mm' : 'h:mm a');
}

export const getFirstLetters = (str: string): string => {
  if (!str) return '';
  
  const words = str.split(" ");

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const firstLetterFirstWord = words[0].charAt(0).toUpperCase();
  const firstLetterSecondWord = words[1].charAt(0).toUpperCase();

  return `${firstLetterFirstWord}${firstLetterSecondWord}`;
};

export function getEventsForYear(events: IEvent[], year: number): IEvent[] {
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 0, 1));
  
  return events.filter(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    
    if (!isValid(eventStart) || !isValid(eventEnd)) {
      return false;
    }
    
    return eventStart <= endOfYearDate && eventEnd >= startOfYearDate;
  });
}
