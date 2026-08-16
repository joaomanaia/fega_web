"use client"

import { useMemo } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { SingleValue } from "react-select"
import ReactAsyncCreatableSelect from "react-select/async-creatable"
import ReactCreatableSelect from "react-select/creatable"
import { Option, styles } from "./utils"

interface CreatableSelectProps {
  onChange: (value?: string) => void
  onCreate?: (value: string) => void
  options?: Option[]
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const CreatableSelect: React.FC<CreatableSelectProps> = ({
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
    <ReactCreatableSelect
      placeholder={placeholder}
      isDisabled={disabled}
      className={cn("h-10 text-sm", className)}
      styles={styles}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      options={options}
    />
  )
}

interface AsyncCreatableSelectProps extends CreatableSelectProps {
  promiseOptions?: (inputValue: string) => Promise<Option[]>
}

export const AsyncCreatableSelect: React.FC<AsyncCreatableSelectProps> = ({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
  className,
  promiseOptions,
}) => {
  const onSelect = (option: SingleValue<Option>) => {
    onChange(option?.value)
  }

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  return (
    <ReactAsyncCreatableSelect
      cacheOptions
      loadOptions={promiseOptions}
      placeholder={placeholder}
      isDisabled={disabled}
      className={cn("h-10 text-sm", className)}
      styles={styles}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      options={options}
    />
  )
}
