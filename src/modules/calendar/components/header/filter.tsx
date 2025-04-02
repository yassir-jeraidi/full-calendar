import {CheckIcon, Filter} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useCalendar} from "@/modules/calendar/contexts/calendar-context";
import type {TEventColor} from "@/modules/calendar/types";
import {Toggle} from "@/components/ui/toggle";
import {useDisclosure} from "@/modules/calendar/hooks";


export default function FilterEvents() {
    const {selectedColors, filterEventsBySelectedColors} = useCalendar();

    const colors: TEventColor[] = [
        "blue",
        "green",
        "red",
        "yellow",
        "purple",
        "orange",
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Toggle
                    variant="outline"
                    className="cursor-pointer w-fit"
                >
                    <Filter className="h-4 w-4"/>
                </Toggle>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                {colors.map((color, index) => (
                    <DropdownMenuItem
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault()
                            filterEventsBySelectedColors(color);
                        }}
                    >
                        <div
                            className={`size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`}
                        />
                        <span className="capitalize flex justify-center items-center gap-2">
                            {color}
                            <span>
                                {selectedColors.includes(color) && (
                                    <span className="text-blue-500">
                                        <CheckIcon className="size-4" />
                                    </span>
                                )}
                            </span>

                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
