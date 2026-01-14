import { apiSlice } from "../../app/api";

export const onboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEcho: builder.query({
      query: (landerName) => ({
        url: `/api/echo/lander?landerName=${landerName}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),
    getOneEcho: builder.query({
      query: (id) => ({
        url: `/api/echo/${id}`,
        method: "GET",
      }),
      providesTags: ["echo"],
    }),
    checkEchoConnection: builder.query({
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
      query: (echo) => ({
        url: "/api/echo",
        method: "POST",
        body: echo,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["echo"],
    }),
    updateEcho: builder.mutation({
      query: ({ id, echo }) => ({
        url: `/api/echo/${id}`,
        method: "POST",
        body: echo,
      }),
      invalidatesTags: ["echo"],
    }),
    deleteEcho: builder.mutation({
      query: (id) => ({
        url: `/api/echo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["echo"],
    }),
  }),
});

export const {
  useGetAllEchoQuery,
  useGetOneEchoQuery,
  useCreateEchoMutation,
  useUpdateEchoMutation,
  useDeleteEchoMutation,
  useCheckEchoConnectionQuery,
} = onboardApi;
