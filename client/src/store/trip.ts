import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "./api"
import type { Trip } from "../types/trip"

const token = localStorage.getItem("auth_token")

export const tripApi = createApi({
  reducerPath: "tripApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API}` }),
  tagTypes: ["trip"],
  endpoints: (builder) => ({
    getTrips: builder.query<Trip[], void>({
      query: () => ({
        url: `/trips`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["trip"],
    }),
    createTrip: builder.mutation<Trip, FormData>({
      query: (formData) => ({
        url: `/trips`,
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["trip"],
    }),
    deleteTrip: builder.mutation<void, number>({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["trip"],
    }),
  }),
})

export const {
  useGetTripsQuery,
  useCreateTripMutation,
  useDeleteTripMutation,
} = tripApi
