"use client"

import { usePathname } from "next/navigation"

interface GroupContainerProps {
  groupListChildren: React.ReactNode
  children: React.ReactNode
}

const GroupContainer: React.FC<GroupContainerProps> = ({ groupListChildren, children }) => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col-reverse xl:flex-row w-full h-full">
      <div className={`xl:flex xl:flex-col w-auto xl:flex-grow h-auto`}>
        {groupListChildren}
      </div>

      {children}
    </div>
  )
}

export default GroupContainer
