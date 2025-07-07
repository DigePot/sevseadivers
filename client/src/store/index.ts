import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./auth/auth"
import { tripApi } from "./trip"
import authReducer from "./auth/auth-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tripApi.reducerPath]: tripApi.reducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, tripApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
