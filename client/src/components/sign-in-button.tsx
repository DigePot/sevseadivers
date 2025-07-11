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
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${className}`}
      {...props}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      Sign In
    </Link>
  )
}
