import React, { type ReactNode } from "react"

interface StaffLayoutProps {
  children: ReactNode
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  return (
    <div className=" bg-gray-100">
      {/* Content */}
      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  )
}
