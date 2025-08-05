import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "./api"
import type { Rental } from "../types/rental"

export const rentalApi = createApi({
  reducerPath: "rentalApi",
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
  tagTypes: ["rental"],
  endpoints: (builder) => ({
    getRentals: builder.query<{ data: { rentals: Rental[] } }, void>({
      query: () => ({
        url: `/rental`,
        method: "GET",
      }),
      providesTags: ["rental"],
    }),
    getRental: builder.query<Rental, string>({
      query: (id) => ({
        url: `/rental/${id}`,
        method: "GET",
      }),
      providesTags: ["rental"],
    }),
    createRental: builder.mutation<Rental, FormData>({
      query: (formData) => ({
        url: `/rental`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["rental"],
    }),
    updateRental: builder.mutation<Rental, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/rental/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["rental"],
    }),
    deleteRental: builder.mutation<void, number>({
      query: (id) => ({
        url: `/rental/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["rental"],
    }),
  }),
})

export const {
  useGetRentalsQuery,
  useGetRentalQuery,
  useCreateRentalMutation,
  useUpdateRentalMutation,
  useDeleteRentalMutation,
} = rentalApi
