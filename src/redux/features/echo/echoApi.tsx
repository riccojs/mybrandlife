import { apiSlice } from "../../app/api";

export const echoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEcho: builder.query({
      query: ({ page, limit, searchBy, statusBy, userId }) => ({
        url: `/api/echo?limit=${limit}&page=${page}&searchBy=${searchBy}&statusBy=${statusBy}&userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["echo"],
    }),
    getOneEcho: builder.query({
      query: (id) => ({
        url: `/api/echo/${id}`,
        method: "GET",
      }),
      providesTags: ["echo"],
    }),
    getStripeConnection: builder.query({
      query: (id) => ({
        url: `/api/echo/stripe/connection/${id}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["echo"],
    }),
    createEcho: builder.mutation({
      query: (slot) => ({
        url: "/api/echo/slot",
        method: "POST",
        credentials: "include",
        body: slot,
      }),
      invalidatesTags: ["echo"],
    }),
    stripeConnectEcho: builder.mutation({
      query: (echo) => ({
        url: "/api/echo/stripe/connect",
        method: "POST",
        credentials: "include",
        body: echo,
      }),
      invalidatesTags: ["echo"],
    }),
    updateEchoStatus: builder.mutation({
      query: ({ id, echo }) => ({
        url: `/api/echo/status/${id}`,
        method: "PATCH",
        credentials: "include",
        body: echo,
      }),
      invalidatesTags: ["echo"],
    }),
    updateEcho: builder.mutation({
      query: ({ id, echo }) => ({
        url: `/api/echo/${id}`,
        method: "PATCH",
        credentials: "include",
        body: echo,
      }),
      invalidatesTags: ["echo"],
    }),
    toggleEcho: builder.mutation({
      query: ({ id, echo }) => ({
        url: `/api/echo/toggle/${id}`,
        method: "PATCH",
        credentials: "include",
        body: echo,
      }),
      invalidatesTags: ["event", "LoggedUser"],
    }),
    deleteEcho: builder.mutation({
      query: (id) => ({
        url: `/api/echo/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["echo"],
    }),
  }),
});

export const {
  useGetAllEchoQuery,
  useGetOneEchoQuery,
  useDeleteEchoMutation,
  useCreateEchoMutation,
  useUpdateEchoMutation,
  useUpdateEchoStatusMutation,
  useToggleEchoMutation,
  useStripeConnectEchoMutation,
  useGetStripeConnectionQuery,
} = echoApi;
