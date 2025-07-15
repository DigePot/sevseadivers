import React from "react"

interface AboutLayoutProps {
  children: React.ReactNode
}

const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 md:p-12">
        {children}
      </div>
    </div>
  )
}

export default AboutLayout 