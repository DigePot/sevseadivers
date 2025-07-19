import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "./api";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/payments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: ({ amount, currency = "USD" }) => ({
        url: "/create-payment-intent",
        method: "POST",
        body: { amount, currency },
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
