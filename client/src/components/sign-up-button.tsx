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
      className={`inline-block bg-[#f0f2f5]  text-[#121717] text-base font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition ${className}`}
      {...props}
    >
      Register
    </Link>
  )
}
