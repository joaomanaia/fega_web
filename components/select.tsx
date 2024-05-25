"use client"

import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { SingleValue } from "react-select"
import CreatableSelect from "react-select/creatable"

type Option = {
  value: string
  label: string
}

interface SelectProps {
  onChange: (value?: string) => void
  onCreate?: (value: string) => void
  options?: Option[]
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  onChange,
  onCreate,
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
    <CreatableSelect
      placeholder={placeholder}
      isDisabled={disabled}
      className={cn("text-sm h-10", className)}
      styles={{
        control: (base) => ({
          ...base,
          height: "2.5rem",
          backgroundColor: "transparent",
          borderRadius: "1rem",
          borderColor: "hsl(var(--outline) / 0.3)",
          ":hover": {
            borderColor: "hsl(var(--outline) / 0.5)",
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "hsl(var(--surface-foreground))",
          ":hover": {
            color: "hsl(var(--surface-foreground))",
          },
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--outline) / 0.3)",
        }),
        input: (base) => ({
          ...base,
          color: "hsl(var(--surface-foreground))",
        }),
        singleValue: (base) => ({
          ...base,
          color: "hsl(var(--surface-foreground))",
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "1rem",
          backgroundColor: "hsl(var(--surface))",
          padding: "0.5rem 0.5rem",
          border: "1px solid hsl(var(--outline) / 0.3)",
        }),
        option: (base) => ({
          ...base,
          borderRadius: "1rem",
          backgroundColor: "hsl(var(--surface))",
          color: "hsl(var(--surface-foreground))",
          ":hover": {
            backgroundColor: "hsl(var(--surface-variant) / 0.3)",
          },
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--text-secondary)",
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      options={options}
    />
  )
}
