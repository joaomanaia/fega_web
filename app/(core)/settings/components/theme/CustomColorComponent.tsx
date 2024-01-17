"use client"

interface CustomColorComponentProps {
  currentColor: string
  onChange: (color: string) => void
}

const CustomColorComponent: React.FC<CustomColorComponentProps> = ({ currentColor, onChange }) => {
  return (
    <div className="h-14 md:h-16 aspect-square p-1 flex items-center justify-center rounded-2xl bg-accent">
      <input
        className="w-full h-full cursor-pointer !outline-none border-none focus:ring-0"
        type="color"
        id="colorPicker"
        value={currentColor}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default CustomColorComponent
