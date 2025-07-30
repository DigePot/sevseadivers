import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "./api"
import type { Trip } from "../types/trip"

export const tripApi = createApi({
  reducerPath: "tripApi",
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
  tagTypes: ["trip"],
  endpoints: (builder) => ({
    getTrips: builder.query<Trip[], void>({
      query: () => ({
        url: `/trips`,
        method: "GET",
      }),
      providesTags: ["trip"],
    }),
    getTrip: builder.query<Trip, string>({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "GET",
      }),
      providesTags: ["trip"],
    }),
    createTrip: builder.mutation<Trip, FormData>({
      query: (formData) => ({
        url: `/trips`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["trip"],
    }),
    updateTrip: builder.mutation<Trip, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/trips/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["trip"],
    }),
    deleteTrip: builder.mutation<void, number>({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["trip"],
    }),
  }),
})

export const {
  useGetTripsQuery,
  useGetTripQuery,
  useCreateTripMutation,
  useDeleteTripMutation,
  useUpdateTripMutation,
} = tripApi
