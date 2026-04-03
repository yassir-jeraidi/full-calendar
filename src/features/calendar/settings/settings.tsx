import {
  DotIcon,
  MoonIcon,
  PaletteIcon,
  SettingsIcon,
  SunMediumIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { MAX_SCROLL_HOUR, MIN_SCROLL_HOUR, useCalendar } from "@/features/calendar/contexts/calendar-context";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

export function Settings() {
  const {
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    startOfDayHour,
    setStartOfDayHour,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
  } = useCalendar();
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";
  const isDotVariant = badgeVariant === "dot";

  const onChangeStartOfDay = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= MIN_SCROLL_HOUR && val <= MAX_SCROLL_HOUR) {
      setStartOfDayHour(val);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Calendar settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Use dark mode
            <DropdownMenuShortcut>
              <Switch
                icon={
                  isDarkMode ? (
                    <MoonIcon className="h-4 w-4" />
                  ) : (
                    <SunMediumIcon className="h-4 w-4" />
                  )
                }
                checked={isDarkMode}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            Use dot badge
            <DropdownMenuShortcut>
              <Switch
                icon={
                  isDotVariant ? (
                    <DotIcon className="w-4 h-4" />
                  ) : (
                    <PaletteIcon className="w-4 h-4" />
                  )
                }
                checked={isDotVariant}
                onCheckedChange={(checked) =>
                  setBadgeVariant(checked ? "dot" : "colored")
                }
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Use 24 hour format
            <DropdownMenuShortcut>
              <Switch
                icon={
                  use24HourFormat ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-24"
                    >
                      <title>24 Hour Format</title>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 0 0 5.998 8.485m12.002 -8.485a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5" />
                      <path d="M12 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
                      <path d="M18 15v2a1 1 0 0 0 1 1h1" />
                      <path d="M21 15v6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-12"
                    >
                      <title>12 Hour Format</title>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 0 0 9 9m9 -9a9 9 0 1 0 -18 0" />
                      <path d="M12 7v5l.5 .5" />
                      <path d="M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
                      <path d="M15 21v-6" />
                    </svg>
                  )
                }
                checked={use24HourFormat}
                onCheckedChange={toggleTimeFormat}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Days start at
            <DropdownMenuShortcut>
              <Input
                type="number"
                value={startOfDayHour}
                max={MAX_SCROLL_HOUR}
                min={MIN_SCROLL_HOUR}
                onChange={onChangeStartOfDay}
                className="w-16"
              />
            </DropdownMenuShortcut>
            h
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Agenda view group by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={agendaModeGroupBy}
            onValueChange={(value) =>
              setAgendaModeGroupBy(value as "date" | "color")
            }
          >
            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="color">Color</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
