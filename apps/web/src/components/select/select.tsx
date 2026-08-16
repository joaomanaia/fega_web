"use client"

import { useMemo } from "react"
import { cn } from "@workspace/ui/lib/utils"
import ReactSelect, { SingleValue } from "react-select"
import { Option, styles } from "./utils"

interface SelectProps {
  onChange: (value?: string) => void
  options?: Option[]
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  onChange,
  options = [],
  value,
  disabled,
  placeholder,
  className,
}) => {
  const onSelect = (option: SingleValue<Option>) => {
    onChange(option?.value)
  }

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  return (
    <ReactSelect
      placeholder={placeholder}
      isDisabled={disabled}
      className={cn("h-10 text-sm", className)}
      styles={styles}
      value={formattedValue}
      onChange={onSelect}
      options={options}
    />
  )
}
