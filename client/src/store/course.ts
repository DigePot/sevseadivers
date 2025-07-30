import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Course } from "../types/course"
import { API } from "./api"

export const courseApi = createApi({
  reducerPath: "courseApi",
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
  tagTypes: ["course"],
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => ({
        url: `/courses/all`,
        method: "GET",
      }),
      providesTags: ["course"],
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: ["course"],
    }),
    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["course"],
    }),
    createCourse: builder.mutation<Course, FormData>({
      query: (formData) => ({
        url: `/courses/add`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["course"],
    }),
    updateCourse: builder.mutation<Course, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["course"],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useDeleteCourseMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} = courseApi
