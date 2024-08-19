import { MainContainer } from "@/app/components/m3/main-container"
import { cn } from "@/lib/utils"

interface BaseSettingsContainerProps {
  header: string
  children?: React.ReactNode
  className?: string
}

export const BaseSettingsContainer: React.FC<BaseSettingsContainerProps> = ({ header, children, className }) => {
  return (
    <MainContainer className={cn("flex flex-col gap-2", className)}>
      <h2 className="text-sm ml-2 mb-2">{header}</h2>
      {children}
    </MainContainer>
  )
}
