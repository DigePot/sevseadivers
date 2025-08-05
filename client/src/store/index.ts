import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./auth/auth"
import { adminApi } from "./admin"
import { tripApi } from "./trip"
import { courseApi } from "./course"
import { galleryApi } from "./gallery"
import { bookingApi } from "./booking"
import authReducer from "./auth/auth-slice"
import { paymentApi } from "./payment"
import { enrollmentApi } from "./enrollment"
import { staffApi } from "./staff"
import { rentalApi } from "./rental"
import bookingReducer from "./booking-slice"

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
    [enrollmentApi.reducerPath]: enrollmentApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [rentalApi.reducerPath]: rentalApi.reducer,
    booking: bookingReducer,
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
      rentalApi.middleware,
      paymentApi.middleware,
      enrollmentApi.middleware,
      staffApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
