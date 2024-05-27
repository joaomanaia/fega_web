"use client"

import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { SingleValue } from "react-select"
import ReactSelect from "react-select"
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
      className={cn("text-sm h-10", className)}
      styles={styles}
      value={formattedValue}
      onChange={onSelect}
      options={options}
    />
  )
}
