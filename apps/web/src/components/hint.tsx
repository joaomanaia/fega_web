import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type TooltipContentProps,
} from "@workspace/ui/components/tooltip"

export interface HintProps extends TooltipContentProps {
  label: string
  children: React.ReactNode
  render?: React.ReactElement
}

export const Hint = ({ label, children, render, ...props }: HintProps) => {
  return (
    <Tooltip>
      <TooltipTrigger render={render}>{children}</TooltipTrigger>
      <TooltipContent {...props}>
        <p className="font-semibold capitalize">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
