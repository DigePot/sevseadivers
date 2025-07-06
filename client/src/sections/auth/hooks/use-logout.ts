import { useCallback } from "react"

import { logout } from "../../../store/auth/auth-slice"
import { useDispatch } from "react-redux"
import { useRouter } from "../../../routes/hooks"
import type { AppDispatch } from "../../../store"

export function useLogout() {
  const dispatch: AppDispatch = useDispatch()

  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout())

      //   onClose?.();
      // router.replace('/');
      router.refresh()
    } catch (error) {
      console.error(error)
      // toast.error('Unable to logout!');
    }
  }, [dispatch, router])

  return {
    handleLogout,
  }
}
