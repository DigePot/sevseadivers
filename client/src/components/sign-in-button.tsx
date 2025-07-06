import React from "react"
import { Link, type LinkProps } from "react-router-dom"
import { CONFIG } from "../global-config"

export interface SignInButtonProps extends Omit<LinkProps, "to"> {
  className?: string
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  className = "",
  ...props
}) => {
  return (
    <Link
      to={CONFIG.auth.redirectPath}
      className={`inline-block bg-[#19b2e5]  text-[#121717] text-base font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition ${className}`}
      {...props}
    >
      Log In
    </Link>
  )
}
