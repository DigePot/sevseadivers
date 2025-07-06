import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "../../utils/base-query-with-re-auth"
import type { UserDT } from "../../types/common"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
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
      }),
      providesTags: ["auth"],
    }),
  }),
})

export const { useSignUpMutation, useGetUserQuery } = authApi
