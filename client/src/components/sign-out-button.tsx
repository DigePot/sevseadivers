import React from "react"
import { useLogout } from "../sections/auth/hooks"

export interface SignOutButtonProps {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({
  className = "",
  onClick,
  children,
  ...props
}) => {
  const { handleLogout } = useLogout()

  return (
    <button
      onClick={(e) => {
        handleLogout()
        if (onClick) onClick(e)
      }}
      className={`inline-block bg-[#19b2e5]  text-[#121717] text-base font-bold px-4 py-2 rounded-xl hover:bg-gray-100 cursor-pointer transition ${className}`}
      {...props}
    >
      {children ? children : "Sign out"}
    </button>
  )
}
