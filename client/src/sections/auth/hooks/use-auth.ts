import { useSelector } from "react-redux"
import type { RootState } from "../../../store"

// ----------------------------------------------------------------------

export function useAuth() {
  const { token, email, role, loading, id } = useSelector(
    (state: RootState) => state.auth
  )

  return {
    authenticated: Boolean(token),
    token,
    email,
    role,
    userId: id,
    loading,
    
  }
}
