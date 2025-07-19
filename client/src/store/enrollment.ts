
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "./api";
import type { 
  Enrollment,
  CreateEnrollmentRequest
} from "../types/enrollment";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/enrollments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Enrollment"],
  endpoints: (builder) => ({
    createEnrollment: builder.mutation<Enrollment, CreateEnrollmentRequest>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enrollment"],
    }),
    getUserEnrollments: builder.query<Enrollment[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Enrollment"],
    }),
    getEnrollmentById: builder.query<Enrollment, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Enrollment", id }],
    }),
    deleteEnrollment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useCreateEnrollmentMutation,
  useGetUserEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useDeleteEnrollmentMutation,
} = enrollmentApi;