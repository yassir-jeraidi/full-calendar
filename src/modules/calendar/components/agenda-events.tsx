import {FC, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {format} from "date-fns";
import {Repeat} from "lucide-react";
import {cn} from "@/lib/utils";
import {useCalendar} from "../contexts/calendar-context";
import {getBgColor, getColorClass, useGetEventsByMode} from "@/modules/calendar/hooks";
import {IEvent} from "@/modules/calendar/interfaces";
import {EventDetailsDialog} from "@/modules/calendar/components/dialogs/event-details-dialog";

const getFirstLetters = (str: string): string => {
    const words = str.split(" ");

    if (words.length < 2) {
        return str;
    }

    const firstLetterFirstWord = words[0].charAt(0);
    const firstLetterSecondWord = words[1].charAt(0);

    return `${firstLetterFirstWord}${firstLetterSecondWord}`;
};


export const AgendaEvents: FC = () => {
    const {events} = useCalendar();
    const eventsByMode = useGetEventsByMode(events);

    return (
        <Command className="py-4 h-[80vh]">
            <div className="mb-4 mx-4 rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..."/>
            </div>
            <CommandList className="max-h-max px-3">
                <CommandGroup>
                    {
                        eventsByMode.map((event) => {
                            return (
                                <CommandItem
                                    key={event.id}
                                    className={cn(
                                        "mb-2 p-4 border rounded-md data-[selected=true]:bg-bg data-[selected=true]:text-none hover:cursor-pointer",
                                        getColorClass(event.color)
                                    )}>
                                    <EventDetailsDialog event={event}>
                                        <div className="w-full flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src="" alt="@shadcn"/>
                                                    <AvatarFallback className={getBgColor(event.color)}>
                                                        {getFirstLetters(event.title)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p>{event.title}</p>
                                            </div>
                                            <div className="w-40 sm:w-auto flex items-center gap-4">
                                                <p className="flex flex-wrap">
                                                <span className="block">
                                                    {format(event.startDate, "MMMM d, ")}
                                                </span>
                                                    <span className="block">
                                                    {format(event.startDate, "HH:mm")}
                                                </span>
                                                </p>
                                                <Repeat/>
                                                <p className="flex flex-wrap">
                                                <span className="block">
                                                    {format(event.endDate, "MMMM d, ")}
                                                </span>
                                                    <span className="block">
                                                    {format(event.endDate, "HH:mm")}
                                                </span>
                                                </p>
                                            </div>
                                        </div>
                                    </EventDetailsDialog>
                                </CommandItem>
                            );
                        })}
                </CommandGroup>
                <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>

        </Command>
    );
};