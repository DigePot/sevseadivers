import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./auth/auth"
import { adminApi } from "./admin/admin"
import { tripApi } from "./trip"
import authReducer from "./auth/auth-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tripApi.reducerPath]: tripApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      tripApi.middleware,
      adminApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
