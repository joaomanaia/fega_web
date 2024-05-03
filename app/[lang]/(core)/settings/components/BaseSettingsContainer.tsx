import { MainContainer } from "../../../../components/m3/main-container"

interface BaseSettingsContainerProps {
  header: string
  children?: React.ReactNode
}

const BaseSettingsContainer: React.FC<BaseSettingsContainerProps> = ({ header, children }) => {
  return (
    <MainContainer className="flex flex-col gap-2">
      <p className="text-sm ml-2 mb-2">{header}</p>
      {children}
    </MainContainer>
  )
}

export default BaseSettingsContainer
