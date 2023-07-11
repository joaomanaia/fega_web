"use client"

import MainContainer from "@/components/m3/MainContainer"
import { List, ListSubheader } from "@mui/material"

interface BaseSettingsContainerProps {
  header: string
  children?: React.ReactNode
}

const BaseSettingsContainer: React.FC<BaseSettingsContainerProps> = ({ header, children }) => {
  return (
    <MainContainer className="flex flex-col">
      <List
        sx={{ width: "100%" }}
        className="space-y-2"
        subheader={<ListSubheader>{header}</ListSubheader>}
      >
        {children}
      </List>
    </MainContainer>
  )
}

export default BaseSettingsContainer
