interface DateTextProps {
  startDate: Date
  endDate: Date
  className?: string
}

export const DateText: React.FC<DateTextProps> = ({ startDate, endDate, className }) => {
  if (startDate.getDate() === endDate.getDate()) {
    if (new Date().getDate() === startDate.getDate()) {
      return <span className={className}>Today</span>
    }

    return <span className={className}>{startDate.toLocaleDateString()}</span>
  }

  return (
    <div className={className}>
      <span aria-label="Start date">{startDate.toLocaleDateString([], { day: "numeric" })}</span>
      <span> - </span>
      <span aria-label="End date">
        {endDate.toLocaleDateString([], { day: "numeric", month: "short" })}
      </span>
    </div>
  )
}
