import React from "react"
import { Link, type LinkProps } from "react-router-dom"
import { paths } from "../routes/paths"

export interface SignUpButtonProps extends Omit<LinkProps, "to"> {
  className?: string
}

export const SignUpButton: React.FC<SignUpButtonProps> = ({
  className = "",
  ...props
}) => {
  return (
    <Link
      to={paths.auth.jwt.signUp}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-600 bg-white border border-cyan-600 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${className}`}
      {...props}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      Sign Up
    </Link>
  )
}
