import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "../routes/hooks"
import { paths } from "../routes/paths"
import type { AppDispatch } from "../store"
import { logout } from "../store/auth/auth-slice"

export interface SignOutButtonProps {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({
  className = "",
  onClick,
  ...props
}) => {
  const dispatch: AppDispatch = useDispatch()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout())

      window.location.href = paths.auth.jwt.signIn
    } catch (error) {
      console.error(error)
    }
  }, [dispatch, router])

  return (
    <button
      onClick={(e) => {
        handleLogout()
        if (onClick) onClick(e)
      }}
      className={`inline-block bg-[#19b2e5]  text-[#121717] text-base font-bold px-4 py-2 rounded-xl hover:bg-gray-100 cursor-pointer transition ${className}`}
      {...props}
    >
      Sign out
    </button>
  )
}
