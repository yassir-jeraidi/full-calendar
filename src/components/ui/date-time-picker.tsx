import {format} from "date-fns"
import type {ControllerRenderProps, UseFormReturn} from "react-hook-form"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area"
import {CalendarIcon} from "lucide-react"
import type {TEventFormData} from "@/modules/calendar/schemas"
import {useCalendar} from "@/modules/calendar/contexts/calendar-context";

interface DatePickerProps {
    form: UseFormReturn<TEventFormData>
    field: ControllerRenderProps<TEventFormData, "endDate" | "startDate">
}

export function DateTimePicker({form, field}: DatePickerProps) {
    const {use24HourFormat} = useCalendar()

    function handleDateSelect(date: Date | undefined) {
        if (date) {
            form.setValue(field.name, date);
        }
    }

    function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
        const currentDate = form.getValues(field.name) || new Date();
        const newDate = new Date(currentDate);

        if (type === "hour") {
            const hour = parseInt(value, 10);
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10));
        } else if (type === "ampm") {
            const hours = newDate.getHours();
            if (value === "AM" && hours >= 12) {
                newDate.setHours(hours - 12);
            } else if (value === "PM" && hours < 12) {
                newDate.setHours(hours + 12);
            }
        }

        form.setValue(field.name, newDate);
    }
    return (
        <FormItem className="flex flex-col">
            <FormLabel>
                {
                    field.name === "startDate"
                        ? "Start Date"
                            : "End Date"
                }
            </FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                                format(field.value,
                                    use24HourFormat
                                        ? "MM/dd/yyyy HH:mm"
                                        : "MM/dd/yyyy hh:mm aa"
                                )

                            ) : (
                                <span>MM/DD/YYYY hh:mm aa</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 12 }, (_, i) => i + 1)
                                        .reverse()
                                        .map((hour) => (
                                            <Button
                                                key={hour}
                                                size="icon"
                                                variant={
                                                    field.value &&
                                                    field.value.getHours() % 12 === hour % 12
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                className="sm:w-full shrink-0 aspect-square"
                                                onClick={() =>
                                                    handleTimeChange("hour", hour.toString())
                                                }
                                            >
                                                {hour}
                                            </Button>
                                        ))}
                                </div>
                                <ScrollBar
                                    orientation="horizontal"
                                    className="sm:hidden"
                                />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                        (minute) => (
                                            <Button
                                                key={minute}
                                                size="icon"
                                                variant={
                                                    field.value &&
                                                    field.value.getMinutes() === minute
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                className="sm:w-full shrink-0 aspect-square"
                                                onClick={() =>
                                                    handleTimeChange("minute", minute.toString())
                                                }
                                            >
                                                {minute.toString().padStart(2, "0")}
                                            </Button>
                                        )
                                    )}
                                </div>
                                <ScrollBar
                                    orientation="horizontal"
                                    className="sm:hidden"
                                />
                            </ScrollArea>
                            <ScrollArea className="">
                                <div className="flex sm:flex-col p-2">
                                    {["AM", "PM"].map((ampm) => (
                                        <Button
                                            key={ampm}
                                            size="icon"
                                            variant={
                                                field.value &&
                                                ((ampm === "AM" &&
                                                        field.value.getHours() < 12) ||
                                                    (ampm === "PM" &&
                                                        field.value.getHours() >= 12))
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("ampm", ampm)}
                                        >
                                            {ampm}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    )
}

