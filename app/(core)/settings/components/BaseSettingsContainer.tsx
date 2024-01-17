import { MainContainer2 } from "../../components/m3/main-container"

interface BaseSettingsContainerProps {
  header: string
  children?: React.ReactNode
}

const BaseSettingsContainer: React.FC<BaseSettingsContainerProps> = ({ header, children }) => {
  return (
    <MainContainer2 className="flex flex-col gap-2">
      <p className="text-sm ml-2">{header}</p>
      {children}
    </MainContainer2>
  )
}

export default BaseSettingsContainer
