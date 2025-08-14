"use client"

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import { DayPicker, type DayPickerProps } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

export type CalendarProps = DayPickerProps

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 border-border/30", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row space-y-4 sm:space-y-0",
        month: "space-y-4",
        nav: "flex items-center justify-between absolute w-full z-10 px-1",
        button_previous: cn(
          buttonVariants({
            variant: "ghost",
            className: "h-7 w-7 bg-transparent text-surface-foreground p-0 opacity-50 hover:opacity-100",
          })
        ),
        button_next: cn(
          buttonVariants({
            variant: "ghost",
            className: "h-7 w-7 bg-transparent text-surface-foreground p-0 opacity-50 hover:opacity-100",
          })
        ),
        month_caption: "flex justify-center items-center h-7",
        caption_label: "text-sm font-medium",
        month_grid: "border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 font-normal text-xs",
        weeks: "",
        week: "flex mt-2",
        day: "p-0",
        outside: "bg-surface",
        range_middle: "bg-primary/20 last:rounded-e-md first:rounded-s-md",
        range_start: "bg-primary/20 rounded-s-md",
        range_end: "bg-primary/20 rounded-e-md",
        ...classNames,
      }}
      components={{
        DayButton({ day, modifiers, className, ...buttonProps }) {
          return (
            <Button
              variant="ghost"
              className={cn(
                className,
                "h-9 w-9 p-0 font-normal rounded-md text-foreground aria-selected:opacity-100 transition",
                modifiers?.today && "bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 hover:text-tertiary-foreground focus:bg-tertiary focus:text-tertiary-foreground",
                modifiers?.selected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                modifiers?.outside && "text-surface-variant opacity-50 pointer-events-none",
                modifiers?.disabled && "opacity-50 text-surface-variant",
                modifiers?.hidden && "invisible",
                modifiers.range_middle &&
                  "bg-transparent text-surface-variant-foreground hover:bg-surface-variant hover:text-surface-variant-foreground rounded-none last:rounded-e-md first:rounded-s-md",
                modifiers.outside && modifiers.selected && "bg-surface-variant/40 text-surface-variant-foreground"
              )}
              {...buttonProps}
              aria-selected={modifiers.selected || buttonProps["aria-selected"]}
              aria-disabled={modifiers.disabled || buttonProps["aria-disabled"]}
              aria-hidden={modifiers.hidden || buttonProps["aria-hidden"]}
            />
          )
        },
        Chevron({ orientation, disabled, className }) {
          const Component =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
              ? ChevronRight
              : orientation === "up"
              ? ChevronUp
              : ChevronDown

          return <Component className={cn("w-4 h-4", className)} aria-disabled={disabled} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
