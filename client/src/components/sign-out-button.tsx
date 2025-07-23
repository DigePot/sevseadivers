import React from "react"
import { FaSignOutAlt } from "react-icons/fa"
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
      type="button"
      className={`
        flex gap-2 items-center justify-center
        bg-gradient-to-b from-cyan-500 to-blue-600
        text-white
        rounded-2xl shadow-lg
        hover:from-cyan-600 hover:to-blue-700
        transition duration-300 ease-in-out
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50
        ${className}
      `}
      {...props}
    >
      <FaSignOutAlt className="text-3xl mb-1" />
      <span className="text-sm font-medium">{children ?? "Sign Out"}</span>
    </button>
  )
}
