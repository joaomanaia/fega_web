import { GroupBase, type StylesConfig } from "react-select"

export type Option = {
  value: string
  label: string
}

export const styles: StylesConfig<Option, false, GroupBase<Option>> = {
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
}
