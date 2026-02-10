import { apiSlice } from "../../app/api";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSlot: builder.query({
      query: (userId) => ({
        url: `/api/brandbook/slot/lander?userId=${userId}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["event"],
    }),
    createEvent: builder.mutation({
      query: (slot) => ({
        url: "/api/brandbook",
        method: "POST",
        credentials: "include",
        body: slot,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["event"],
    }),
  }),
});

export const { useCreateEventMutation, useGetAllSlotQuery } = eventApi;
