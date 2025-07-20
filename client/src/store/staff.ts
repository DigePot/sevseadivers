import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Staff } from "../types/staff";
import { API } from "./api";

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API}` }),
  tagTypes: ["staff"],
  endpoints: (builder) => ({
    getAllStaff: builder.query<Staff[], void>({
      query: () => ({
        url: "/staff",
        method: "GET",
      }),
      providesTags: ["staff"],
    }),
    getOneStaff: builder.query<Staff, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "GET",
      }),
      providesTags: ["staff"],
    }),
  }),
});

export const { useGetAllStaffQuery, useGetOneStaffQuery } = staffApi;
