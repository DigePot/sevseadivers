import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "./api"
import type { Gallery } from "../types/gallery"

export const galleryApi = createApi({
  reducerPath: "galleryApi",
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
  tagTypes: ["gallery"],
  endpoints: (builder) => ({
    getGallery: builder.query<Gallery[], void>({
      query: () => ({
        url: `/gallery`,
        method: "GET",
      }),
      providesTags: ["gallery"],
    }),
    getOneGallery: builder.query<Gallery, string>({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: "GET",
      }),
      providesTags: ["gallery"],
    }),
    deleteGallery: builder.mutation<void, number>({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallery"],
    }),
    createGallery: builder.mutation<Gallery, FormData>({
      query: (formData) => ({
        url: `/gallery`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["gallery"],
    }),
    updateGallery: builder.mutation<
      Gallery,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/gallery/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["gallery"],
    }),
  }),
})

export const {
  useGetGalleryQuery,
  useGetOneGalleryQuery,
  useDeleteGalleryMutation,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
} = galleryApi
