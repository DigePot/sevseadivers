
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "./api";
import type { 
  Enrollment,
  CreateEnrollmentRequest
} from "../types/enrollment";


export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}`, 
  prepareHeaders: (headers) => {
  const token = localStorage.getItem("auth_token"); 
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
},
  
  }),
  endpoints: (builder) => ({
    createEnrollment: builder.mutation<Enrollment, CreateEnrollmentRequest>({
      query: (body) => ({
        url: "/enrollments/add", 
        method: "POST",
        body,
      }),
      // ...
    }),
    // Other endpoints use "/enrollments" prefix:
    getUserEnrollments: builder.query<Enrollment[], void>({
      query: () => ({
        url: "/enrollments/my", 
        method: "GET",
      }),
    }),
    getEnrollmentById: builder.query<Enrollment, number>({
      query: (id) => ({
        url: `/enrollments/${id}`, 
        method: "GET",
      }),
    }),
    deleteEnrollment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/enrollments/${id}`, 
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateEnrollmentMutation,
  useGetUserEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useDeleteEnrollmentMutation,
} = enrollmentApi;