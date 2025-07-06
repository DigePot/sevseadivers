import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { API } from "../store/api"

export const baseQueryWithReauth: BaseQueryFn<
  | string
  | { url: string; method?: string; body?: any; params?: Record<string, any> },
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  })

  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Clear auth-related data from local storage
    localStorage.clear()
    localStorage.removeItem("auth_token")
    localStorage.removeItem("role")

    // Instead of redirecting, we could show an error message, or you can handle it differently
    // For example, you can dispatch an action to update the state in your app about the authentication error
    console.error("Authentication failed. Token is no longer valid.")

    // Optionally, you can return the error result if you want to handle it later
    return result
  }

  return result
}
