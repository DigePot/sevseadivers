import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { UserDT } from "../../types/common"
import { API } from "../api"

const token = localStorage.getItem("auth_token")

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API}` }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    signUp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/sign-up",
        method: "POST",
        body,
      }),
    }),

    getUser: builder.query<UserDT, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["auth"],
    }),
  }),
})

export const { useSignUpMutation, useGetUserQuery } = authApi
