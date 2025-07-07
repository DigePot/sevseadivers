import { useCallback } from "react"

import { logout } from "../../../store/auth/auth-slice"
import { useDispatch } from "react-redux"
import { useRouter } from "../../../routes/hooks"
import type { AppDispatch } from "../../../store"
import { paths } from "../../../routes/paths"

export function useLogout() {
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

  return {
    handleLogout,
  }
}
