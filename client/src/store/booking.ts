import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "./api"
import type { Booking } from "../types/booking"

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["booking"],
  endpoints: (builder) => ({
    getAllBooking: builder.query<Booking[], void>({
      query: () => ({
        url: `/bookings`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    updateBookingStatus: builder.mutation<
      Booking,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/bookings/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["booking"],
    }),
  }),
})

export const { useGetAllBookingQuery, useUpdateBookingStatusMutation } =
  bookingApi
