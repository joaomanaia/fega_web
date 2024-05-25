"use client"

import { Calendar } from "../calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { TimePicker } from "./time-picker"

interface TimePickerPopoverProps {
  value: Date
  onChange: (date: Date | undefined) => void
  children: React.ReactNode
}

export const TimePickerPopover: React.FC<TimePickerPopoverProps> = ({
  value,
  onChange,
  children,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        <div className="p-3 border-t border-border/30">
          <TimePicker setDate={onChange} date={value} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
