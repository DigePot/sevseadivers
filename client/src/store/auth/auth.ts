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

    updateMyProfile: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),

    forgotPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/users/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/users/reset-password",
        method: "POST",
        body,
      }),
    }),

    sendContactMessage: builder.mutation<
      { success: boolean; message: string },
      {
        name: string
        email: string
        subject: string
        message: string
        phoneNumber?: string
      }
    >({
      query: (body) => ({
        url: "/users/contact",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const {
  useSignUpMutation,
  useGetUserQuery,
  useUpdateMyProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendContactMessageMutation,
} = authApi
