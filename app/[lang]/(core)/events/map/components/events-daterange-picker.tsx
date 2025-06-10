"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import qs from "query-string"
import { useRouter } from "@/src/i18n/navigation"

interface EventsDateRangePickerProps {
  dateRange?: DateRange
  className?: string
}

export const EventsDateRangePicker: React.FC<EventsDateRangePickerProps> = ({
  dateRange,
  className,
}) => {
  // from today to end of the year
  const [date, setDate] = useState<DateRange | undefined>(dateRange)

  const router = useRouter()

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date)

    if (!date || !date.from || !date.to) {
      return
    }

    const url = qs.stringifyUrl({
      url: "/events/map",
      query: {
        fromDate: date.from?.toISOString(),
        toDate: date.to?.toISOString(),
      },
    })

    router.push(url)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] border-surfaceVariant/50 bg-surfaceVariant/30 hover:bg-surfaceVariant/40 rounded-2xl justify-start text-left font-normal text-surfaceVariant-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
