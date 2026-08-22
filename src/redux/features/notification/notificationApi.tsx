import { apiSlice } from "../../app/api";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: ({ page, limit, searchBy, seenBy }) => ({
        url: `/api/notification?limit=${limit}&page=${page}&searchBy=${searchBy}&seenBy=${seenBy}`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
    getOneNotification: builder.query({
      query: (id) => ({
        url: `/api/notification/${id}`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
    seenNotification: builder.mutation({
      query: ({ id, infoData }) => ({
        url: `/api/notification/${id}`,
        method: "PATCH",
        credentials: "include",
        body: infoData,
      }),
      invalidatesTags: ["notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/api/notification/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetAllNotificationQuery,
  useGetOneNotificationQuery,
  useDeleteNotificationMutation,
  useSeenNotificationMutation,
} = notificationApi;
