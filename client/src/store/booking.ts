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
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getAllBooking: builder.query<Booking[], void>({
      query: () => ({
        url: `/bookings`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getBookingById: builder.query<Booking, number>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),
    cancelBooking: builder.mutation<Booking, number>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        "Booking",
        { type: "Booking", id }
      ],
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
      invalidatesTags: (result, error, { id }) => [
        "Booking",
        { type: "Booking", id }
      ],
    }),
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (body) => {
        const payload = { ...body };
        if (payload.tripId) payload.tripId = Number(payload.tripId);
        return {
          url: `/bookings`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Booking"],
    }),
    deleteBooking: builder.mutation<void, number>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
})

export const { 
  useGetAllBookingQuery, 
  useGetBookingByIdQuery,
  useCancelBookingMutation,
  useUpdateBookingStatusMutation, 
  useCreateBookingMutation,
  useDeleteBookingMutation
} = bookingApi;