import {formatTime} from "@/modules/components/calendar/helpers";
import {
    Modal,
    ModalContent,
    ModalTrigger,
    ModalHeader,
    ModalTitle
} from "@/components/ui/responsive-modal";
import {cn} from "@/lib/utils";

import {ReactNode} from "react";
import {IEvent} from "@/modules/components/calendar/interfaces";
import {dayCellVariants} from "@/modules/components/calendar/views/month-view/day-cell";
import {EventBullet} from "@/modules/components/calendar/views/month-view/event-bullet";
import {useCalendar} from "@/modules/components/calendar/contexts/calendar-context";
import {format} from "date-fns";

interface EventListDialogProps {
    date: Date;
    events: IEvent[];
    maxVisibleEvents?: number;
    children?: ReactNode;
}

export function EventListDialog({
                                    date,
                                    events,
                                    maxVisibleEvents = 3,
                                    children
                                }: EventListDialogProps) {
    const cellEvents = events;
    const hiddenEventsCount = Math.max(cellEvents.length - maxVisibleEvents, 0);
    const {badgeVariant, use24HourFormat} = useCalendar();

    const defaultTrigger = (
        <span className="cursor-pointer">
      <span className="sm:hidden">
        +{hiddenEventsCount}
      </span>
      <span className="hidden sm:inline py-0.5 px-2 my-1 rounded-xl border">
         {hiddenEventsCount}
          <span className="mx-1">more...</span>
      </span>
    </span>
    );

    return (
        <Modal>
            <ModalTrigger asChild>
                {children || defaultTrigger}
            </ModalTrigger>
            <ModalContent className="sm:max-w-[425px]">
                <ModalHeader>
                    <ModalTitle className='my-2'>
                        <div className="flex items-center gap-2">
                            <EventBullet color={cellEvents[0]?.color} className=""/>
                            <p className="text-sm font-medium">
                                Events on {
                                format(date, "EEEE, MMMM d, yyyy")
                            }
                            </p>
                        </div>
                    </ModalTitle>
                </ModalHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                    {
                        cellEvents.length > 0 ? (
                            cellEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "flex items-center gap-2 p-2 border rounded-md hover:bg-muted",
                                        {
                                            [dayCellVariants({color: event.color})]: badgeVariant === "colored",
                                        }
                                    )}
                                >
                                    <EventBullet color={event.color}/>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-sm font-medium">{event.title}</p>
                                        <p className="text-xs">
                                            {formatTime(event.startDate, use24HourFormat)}
                                        </p>
                                    </div>
                                </div>
                            ))) : (
                            <p className="text-sm text-muted-foreground">
                                No events for this date.
                            </p>
                        )
                    }
                </div>
            </ModalContent>
        </Modal>
    );
}