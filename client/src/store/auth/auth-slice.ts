import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  token: string | null
  email: string | null
  role: string | null
  loading: boolean
  id: string | null
}

const initialState: AuthState = {
  token:
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
  email: null,
  role: typeof window !== "undefined" ? localStorage.getItem("role") : null,
  loading: false,
  id: typeof window !== "undefined" ? localStorage.getItem("id") : null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string
        email: string
        role: string
        id: string
      }>
    ) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.role = action.payload.role
      state.loading = false

      localStorage.setItem("auth_token", action.payload.token)
      localStorage.setItem("role", action.payload.role)
      localStorage.setItem("id", action.payload.id)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.role = null
      state.loading = false
      state.id = null

      localStorage.removeItem("auth_token")
      localStorage.removeItem("role")
      localStorage.removeItem("id")
    },
  },
})

export const { setCredentials, setLoading, logout } = authSlice.actions
export default authSlice.reducer
