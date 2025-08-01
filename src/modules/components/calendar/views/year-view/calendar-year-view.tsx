import {motion} from "framer-motion";
import {getYear, isSameDay, isSameMonth} from "date-fns";
import {useCalendar} from "@/modules/components/calendar/contexts/calendar-context";
import {staggerContainer, transition} from "@/modules/components/calendar/animations";
import {getCalendarCells} from "@/modules/components/calendar/helpers";
import {cn} from "@/lib/utils";
import {IEvent} from "@/modules/components/calendar/interfaces";
import {EventBullet} from "@/modules/components/calendar/views/month-view/event-bullet";
import {EventListDialog} from "@/modules/components/calendar/dialogs/events-list-dialog";

interface IProps {
    singleDayEvents: IEvent[];
    multiDayEvents: IEvent[];
}

const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarYearView({singleDayEvents, multiDayEvents}: IProps) {
    const {selectedDate, setSelectedDate} = useCalendar();
    const currentYear = getYear(selectedDate);
    const allEvents = [...multiDayEvents, ...singleDayEvents];

    return (
        <div className="flex flex-col h-full min-h-[80vh] overflow-y-auto p-4 sm:p-6">
            {/* Warning for small screens */}
            <motion.div
                className="flex flex-col items-center justify-center py-4 text-sm text-muted-foreground sm:hidden"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={transition}
                role="alert"
            >
                <p>Yearly view is best viewed on larger screens.</p>
                <p className="mt-1">Switch to daily or monthly view for better experience.</p>
            </motion.div>

            {/* Year grid */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr"
            >
                {MONTHS.map((month, monthIndex) => {
                    const monthDate = new Date(currentYear, monthIndex, 1);
                    const cells = getCalendarCells(monthDate);

                    return (
                        <motion.div
                            key={month}
                            className="flex flex-col border border-border rounded-lg shadow-sm overflow-hidden"
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{delay: monthIndex * 0.05, ...transition}}
                            role="region"
                            aria-label={`${month} ${currentYear} calendar`}
                        >
                            {/* Month header */}
                            <div
                                className="px-3 py-2 text-center font-semibold text-sm sm:text-base cursor-pointer hover:bg-primary/20 transition-colors"
                                onClick={() => setSelectedDate(new Date(currentYear, monthIndex, 1))}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setSelectedDate(new Date(currentYear, monthIndex, 1));
                                    }
                                }}
                                aria-label={`Select ${month}`}
                            >
                                {month}
                            </div>

                            <div
                                className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground py-2">
                                {WEEKDAYS.map((day) => (
                                    <div key={day} className="p-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-0.5 p-1.5 flex-grow text-xs">
                                {cells.map((cell) => {
                                    const isCurrentMonth = isSameMonth(cell.date, monthDate);
                                    const isToday = isSameDay(cell.date, new Date());
                                    const dayEvents = allEvents.filter((event) =>
                                        isSameDay(new Date(event.startDate), cell.date)
                                    );
                                    const hasEvents = dayEvents.length > 0;

                                    return (
                                        <div
                                            key={cell.date.toISOString()}
                                            className={cn(
                                                "flex flex-col items-center justify-start p-1 min-h-[2rem] relative",
                                                !isCurrentMonth && "text-muted-foreground/40",
                                                hasEvents && isCurrentMonth ? "cursor-pointer hover:bg-accent/20 hover:rounded-md" : "cursor-default"
                                            )}
                                        >
                                            {isCurrentMonth && hasEvents ? (
                                                <EventListDialog date={cell.date} events={dayEvents}>
                                                    <div
                                                        className="w-full h-full flex flex-col items-center justify-start gap-0.5">
                                                        <span
                                                            className={cn(
                                                                "size-5 flex items-center justify-center font-medium",
                                                                isToday && "rounded-full bg-primary text-primary-foreground"
                                                            )}
                                                        >
                                                          {cell.day}
                                                        </span>
                                                        <div className="flex justify-center items-center gap-0.5">
                                                            {dayEvents.length <= 2 ? (
                                                                dayEvents.slice(0, 2).map((event) => (
                                                                    <EventBullet
                                                                        key={event.id}
                                                                        color={event.color}
                                                                        className="size-1.5"
                                                                    />
                                                                ))
                                                            ) : (
                                                                <div className='flex flex-col justify-center items-center'>
                                                                    <EventBullet
                                                                        color={dayEvents[0].color}
                                                                        className="size-1.5"
                                                                    />
                                                                    <span className='text-[0.6rem]'>
                                                                            +{dayEvents.length - 1}
                                                                        </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </EventListDialog>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-start">
                                                  <span
                                                      className={cn(
                                                          "size-5 flex items-center justify-center font-medium",
                                                      )}
                                                  >
                                                    {cell.day}
                                                  </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}