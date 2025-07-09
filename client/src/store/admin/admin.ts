import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "../api"
import type { Staff } from "../../types/staff"
import type { DashboardStats } from "../../types/dashboard-stats"

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["admin"],
  endpoints: (builder) => ({
    getAllStaff: builder.query<Staff[], void>({
      query: () => ({
        url: `/admin/staff`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    getOneStaff: builder.query<Staff, string>({
      query: (id) => ({
        url: `/admin/staff/${id}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    deleteStaff: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
    createStaff: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/staff",
        method: "POST",
        body,
      }),
    }),
    updateStaff: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/staff/${id}`,
        method: "PUT",
        body,
      }),
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: `/admin/dashboard/stats`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
  }),
})

export const {
  useGetAllStaffQuery,
  useGetOneStaffQuery,
  useDeleteStaffMutation,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useGetDashboardStatsQuery,
} = adminApi
