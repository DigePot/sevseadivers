import React, { useState } from "react"
import AuthWrapper from "../../components/auth-wrapper"
import { SignInForm } from "../../components/sign-in-form"
import { SignUpForm } from "../../components/sign-up-form"

export const JwtSignUpView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signUp")

  // Handle tab switching
  const handleTabChange = (tab: "signIn" | "signUp") => {
    setActiveTab(tab)
  }

  return (
    <AuthWrapper
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      signInContent={<SignInForm />}
      signUpContent={<SignUpForm />}
    />
  )
}
