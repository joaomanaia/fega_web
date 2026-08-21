"use client"

import * as React from "react"
import { Calendar } from "@workspace/ui/components/calendar"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import {
  getArrowByType,
  getDateByType,
  setDateByType,
  type Period,
  type TimePickerType,
} from "@workspace/ui/lib/time-picker-utils"
import { cn } from "@workspace/ui/lib/utils"
import { Clock } from "lucide-react"

interface TimePickerDemoProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  )
}

export interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  period?: Period
  onRightFocus?: () => void
  onLeftFocus?: () => void
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      period,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref,
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false)
    const [prevIntKey, setPrevIntKey] = React.useState<string>("0")

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false)
        }, 2000)

        return () => clearTimeout(timer)
      }
    }, [flag])

    const calculatedValue = React.useMemo(() => {
      return getDateByType(date, picker)
    }, [date, picker])

    const calculateNewValue = (key: string) => {
      /*
       * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
       * The second entered digit will break the condition and the value will be set to 10-12.
       */
      if (picker === "12hours") {
        if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0") return "0" + key
      }

      return !flag ? "0" + key : calculatedValue.slice(1, 2) + key
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") return
      e.preventDefault()
      if (e.key === "ArrowRight") onRightFocus?.()
      if (e.key === "ArrowLeft") onLeftFocus?.()
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1
        const newValue = getArrowByType(calculatedValue, step, picker)
        if (flag) setFlag(false)
        const tempDate = new Date(date)
        setDate(setDateByType(tempDate, newValue, picker, period))
      }
      if (e.key >= "0" && e.key <= "9") {
        if (picker === "12hours") setPrevIntKey(e.key)

        const newValue = calculateNewValue(e.key)
        if (flag) onRightFocus?.()
        setFlag((prev) => !prev)
        const tempDate = new Date(date)
        setDate(setDateByType(tempDate, newValue, picker, period))
      }
    }

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground w-[48px] text-center font-mono text-base tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        value={value || calculatedValue}
        onChange={(e) => {
          e.preventDefault()
          onChange?.(e)
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(e) => {
          onKeyDown?.(e)
          handleKeyDown(e)
        }}
        {...props}
      />
    )
  },
)

TimePickerInput.displayName = "TimePickerInput"

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
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} />
        <div className="border-border/30 border-t p-3">
          <TimePicker setDate={onChange} date={value} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
