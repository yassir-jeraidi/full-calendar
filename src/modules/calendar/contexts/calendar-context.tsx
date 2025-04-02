"use client";

import {createContext, useContext, useState, useCallback} from "react";

import type {IEvent, IUser} from "@/modules/calendar/interfaces";
import {TCalendarView, TEventColor} from "@/modules/calendar/types";

interface ICalendarContext {
    selectedDate: Date;
    view: TCalendarView;
    setView: (view: TCalendarView) => void;
    isAgendaMode: boolean;
    toggleAgendaMode: (isAgenda?: boolean) => void;
    use24HourFormat: boolean;
    toggleTimeFormat: () => void;
    setSelectedDate: (date: Date | undefined) => void;
    selectedUserId: IUser["id"] | "all";
    setSelectedUserId: (userId: IUser["id"] | "all") => void;
    badgeVariant: "dot" | "colored";
    setBadgeVariant: (variant: "dot" | "colored") => void;
    selectedColors: TEventColor[];
    filterEventsBySelectedColors: (colors: TEventColor) => void;
    users: IUser[];
    events: IEvent[];
    addEvent: (event: IEvent) => void;
    updateEvent: (event: IEvent) => void;
    removeEvent: (eventId : number) => void;
}

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
                                     children,
                                     users,
                                     events,
                                     badge = "colored",
                                     view = "day",
                                 }: {
    children: React.ReactNode;
    users: IUser[];
    events: IEvent[];
    view?: "day" | "week" | "month";
    badge?: "dot" | "colored";
}) {
    const [badgeVariant, setBadgeVariant] = useState<"dot" | "colored">(badge);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">("all");
    const [currentView, setCurrentView] = useState(view);
    const [isAgendaMode, setAgendaMode] = useState(false);
    const [use24HourFormat, setUse24HourFormat] = useState(true);
    const [selectedColors, setSelectedColors] = useState<TEventColor[]>([]);
    const [data, setData] = useState(events || []);

    const filterEventsBySelectedColors = (color: TEventColor) => {
        const isColorSelected = selectedColors.includes(color)
        const newColors = isColorSelected
            ? selectedColors.filter((c) => c !== color)
            : [...selectedColors, color];

        if (newColors.length > 0) {
            const filteredEvents = events.filter((event) => {
                const eventColor = event.color || "blue";
                return newColors.includes(eventColor);
            });
            setData(filteredEvents);
        } else setData(events);

        setSelectedColors(newColors);
    }

    const toggleAgendaMode = (isAgenda?: boolean) => {
        const newMode = isAgenda ?? !isAgendaMode;
        if (!newMode) {
            setCurrentView(view);
        }
        setAgendaMode(newMode);
    };

    const toggleTimeFormat = () => {
        setUse24HourFormat(prev => !prev);
      };
      
    const handleSelectDate = (date: Date | undefined) => {
        if (!date) return;
        setSelectedDate(date);
    };

    const setView = (view: "day" | "week" | "month") => {
        setCurrentView(view);
    };

    const addEvent = (event: IEvent) => {
        setData((prevEvents) => [...prevEvents, event]);
    };

    const updateEvent = (event: IEvent) => {
        const newEvent: IEvent = event;
        newEvent.startDate = new Date(event.startDate).toISOString();
        newEvent.endDate = new Date(event.endDate).toISOString();
        setData((prevEvents) => {
            const index = prevEvents.findIndex((e) => e.id === event.id);
            if (index !== -1) {
                const updatedEvents = [...prevEvents];
                updatedEvents[index] = newEvent;
                return updatedEvents;
            }
            return prevEvents;
        });
    };

    const removeEvent = (eventId: number) => {
        setData((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    };

    const value = {
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        users,
        selectedColors,
        filterEventsBySelectedColors,
        events: data,
        view: currentView,
        use24HourFormat,
        toggleTimeFormat,
        setView,
        isAgendaMode,
        toggleAgendaMode,
        addEvent,
        updateEvent,
        removeEvent,
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar(): ICalendarContext {
    const context = useContext(CalendarContext);
    if (!context)
        throw new Error("useCalendar must be used within a CalendarProvider.");
    return context;
}
