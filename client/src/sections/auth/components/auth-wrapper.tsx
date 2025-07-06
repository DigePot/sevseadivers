import React from "react"
import TabHeader from "./tab-header"

interface AuthWrapperProps {
  activeTab: "signIn" | "signUp"
  handleTabChange: (tab: "signIn" | "signUp") => void
  signInContent: React.ReactNode
  signUpContent: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  activeTab,
  handleTabChange,
  signInContent,
  signUpContent,
}) => {
  return (
    <div className="flex items-center justify-center bg-[#20C2F8AB] px-16 py-5 rounded-2xl">
      <div className="w-full bg-transparent">
        <TabHeader activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "signIn" ? signInContent : signUpContent}
      </div>
    </div>
  )
}

export default AuthWrapper
