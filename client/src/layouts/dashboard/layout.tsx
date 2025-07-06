import React, { type ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className=" bg-gray-100">
      {/* Content */}
      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  )
}
