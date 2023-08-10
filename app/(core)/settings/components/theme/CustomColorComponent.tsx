"use client"

import { Card } from "@mui/material"

interface CustomColorComponentProps {
  currentColor: string
  onChange: (color: string) => void
}

const CustomColorComponent: React.FC<CustomColorComponentProps> = ({ currentColor, onChange }) => {
  return (
    <Card variant="filled" className="w-16 h-16 p-1 flex items-center justify-center">
        <input 
          className="w-full h-full cursor-pointer"
          type="color"
          id="colorPicker"
          value={currentColor}
          onChange={(e) => onChange(e.target.value)} />
    </Card>
  )
}

export default CustomColorComponent
