import React from "react";
import {CalendarProvider} from "@/modules/components/calendar/contexts/calendar-context";
import {CalendarHeader} from "@/modules/components/calendar/header/calendar-header";
import {CalendarBody} from "@/modules/components/calendar/calendar-body";

import {DndProvider} from "@/modules/components/calendar/contexts/dnd-context";
import {getEvents, getUsers} from "@/modules/components/calendar/requests";

async function getCalendarData() {
    return {
        events: await getEvents(),
        users: await getUsers()
    };
}

export async function Calendar() {

    const {events, users} = await getCalendarData();

    return (
        <CalendarProvider events={events} users={users} view="month">
            <DndProvider>
                <div className="w-full border rounded-xl">
                    <CalendarHeader/>
                    <CalendarBody/>
                </div>
            </DndProvider>
        </CalendarProvider>
    );
}