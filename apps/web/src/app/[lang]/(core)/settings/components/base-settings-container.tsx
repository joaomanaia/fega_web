import { cn } from "@workspace/ui/lib/utils"
import { MainContainer } from "@/app/components/m3/main-container"

interface BaseSettingsContainerProps {
  header: string
  children?: React.ReactNode
  className?: string
}

export const BaseSettingsContainer: React.FC<BaseSettingsContainerProps> = ({
  header,
  children,
  className,
}) => {
  return (
    <MainContainer className={cn("flex flex-col gap-2", className)}>
      <h2 className="mb-2 ml-2 text-sm">{header}</h2>
      {children}
    </MainContainer>
  )
}
