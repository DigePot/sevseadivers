import React from "react"

interface TabHeaderProps {
  activeTab: "signIn" | "signUp"
  onTabChange: (tab: "signIn" | "signUp") => void
}

const TabHeader: React.FC<TabHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div>
      <h1 className="text-[#121717] text-2xl font-bold">
        Welcome to SEVSEA DIVERS
      </h1>
      <div className="flex space-x-4 mb-6 border-b-2 border-[#DBE3E5]">
        <button
          onClick={() => onTabChange("signIn")}
          className={`w-full py-2 text-center font-semibold cursor-pointer ${
            activeTab === "signIn"
              ? "border-b-2 border-[#DBE3E5] text-[#121717]"
              : "text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => onTabChange("signUp")}
          className={`w-full py-2 text-center font-semibold cursor-pointer ${
            activeTab === "signUp"
              ? "border-b-2 border-[#DBE3E5] text-[#121717]"
              : "text-white"
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default TabHeader
