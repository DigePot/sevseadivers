import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./auth/auth"
import { adminApi } from "./admin"
import { tripApi } from "./trip"
import { courseApi } from "./course"
import { galleryApi } from "./gallery"
import { bookingApi } from "./booking"
import authReducer from "./auth/auth-slice"
import { paymentApi } from "./payment";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tripApi.reducerPath]: tripApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      tripApi.middleware,
      adminApi.middleware,
      courseApi.middleware,
      galleryApi.middleware,
      bookingApi.middleware,
      paymentApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
