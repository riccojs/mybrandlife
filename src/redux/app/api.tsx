import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "REST_API",
  baseQuery,
  tagTypes: [
    "update",
    "business",
    "category",
    "LoggedUser",
    "contact",
    "event",
    "echo",
    "domain",
    "partner",
    "referral",
    "report",
    "wistband",
    "pulsetrack",
    "wistbandCart",
    "spin",
    "notification",
  ],
  endpoints: () => ({}),
});
