import { useState } from "react"
import React from "react"
import AuthWrapper from "../../components/auth-wrapper"
import { SignInForm } from "../../components/sign-in-form"
import { SignUpForm } from "../../components/sign-up-form"

export const JwtSignInView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn")

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
