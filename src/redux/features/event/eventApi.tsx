import { apiSlice } from "../../app/api";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvent: builder.query({
      query: ({ page, limit, searchBy, statusBy, userId }) => ({
        url: `/api/brandbook?limit=${limit}&page=${page}&searchBy=${searchBy}&statusBy=${statusBy}&userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),
    getAllSlot: builder.query({
      query: ({ page, limit, userId }) => ({
        url: `/api/brandbook/slot?limit=${limit}&page=${page}&userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),
    getOneEvent: builder.query({
      query: (id) => ({
        url: `/api/brandbook/${id}`,
        method: "GET",
      }),
      providesTags: ["event"],
    }),
    googleConnect: builder.mutation<void, void>({
      query: () => ({
        url: "/api/brandbook/google",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["event"],
    }),
    createSlot: builder.mutation({
      query: (slot) => ({
        url: "/api/brandbook/slot",
        method: "POST",
        credentials: "include",
        body: slot,
      }),
      invalidatesTags: ["event"],
    }),
    toggleEvent: builder.mutation({
      query: ({ id, event }) => ({
        url: `/api/brandbook/toggle/${id}`,
        method: "PATCH",
        credentials: "include",
        body: event,
      }),
      invalidatesTags: ["event", "LoggedUser"],
    }),
    updateEventStatus: builder.mutation({
      query: ({ id, event }) => ({
        url: `/api/brandbook/status/${id}`,
        method: "PATCH",
        credentials: "include",
        body: event,
      }),
      invalidatesTags: ["event", "LoggedUser"],
    }),
    updateEvent: builder.mutation({
      query: ({ id, brandbook }) => ({
        url: `/api/brandbook/${id}`,
        method: "PATCH",
        credentials: "include",
        body: brandbook,
      }),
      invalidatesTags: ["event", "LoggedUser"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/api/brandbook/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["event"],
    }),
    deleteSlot: builder.mutation({
      query: (id) => ({
        url: `/api/brandbook/slot/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["event"],
    }),
  }),
});

export const {
  useGetAllEventQuery,
  useGetOneEventQuery,
  useDeleteEventMutation,
  useToggleEventMutation,
  useGetAllSlotQuery,
  useGoogleConnectMutation,
  useCreateSlotMutation,
  useDeleteSlotMutation,
  useUpdateEventStatusMutation,
  useUpdateEventMutation,
} = eventApi;
