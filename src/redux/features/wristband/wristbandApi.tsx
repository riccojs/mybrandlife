import { apiSlice } from "../../app/api";

export const wristbandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWristband: builder.query({
      query: ({ page, limit, statusBy, searchBy }) => ({
        url: `/api/wristband?limit=${limit}&page=${page}&statusBy=${statusBy}&searchBy=${searchBy}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["wistband"],
    }),
    getAllWristbandItem: builder.query({
      query: ({
        page,
        limit,
        statusBy,
        userId,
        modeBy,
        searchBy,
        pulsetrackId,
      }) => ({
        url: `/api/wristband/item?limit=${limit}&page=${page}&statusBy=${statusBy}&userId=${userId}&modeBy=${modeBy}&searchBy=${searchBy}&pulsetrackId=${pulsetrackId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["wistband"],
    }),
    getAllWristbandItemMode: builder.query({
      query: ({ page, limit, statusBy, userId, searchBy, modeBy }) => ({
        url: `/api/wristband/item/mode?limit=${limit}&page=${page}&statusBy=${statusBy}&userId=${userId}&searchBy=${searchBy}&modeBy=${modeBy}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["wistband"],
    }),
    getAllOrderedWristbandItem: builder.query({
      query: (transcationId) => ({
        url: `/api/wristband/item/ordered/${transcationId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["wistband"],
    }),
    getOneWristbandItem: builder.query({
      query: (id) => ({
        url: `/api/wristband/item/tracking/${id}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["wistband"],
    }),
    getOneWristbandItemById: builder.query({
      query: (id) => ({
        url: `/api/wristband/item/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["wistband"],
    }),
    getOneWristband: builder.query({
      query: (id) => ({
        url: `/api/wristband/${id}`,
        method: "GET",
      }),
      providesTags: ["wistband"],
    }),
    createWristband: builder.mutation({
      query: (formdata) => ({
        url: "/api/wristband",
        method: "POST",
        body: formdata,
        credentials: "include",
      }),
      invalidatesTags: ["wistband"],
    }),
    createPlanWristband: builder.mutation({
      query: (wristband) => ({
        url: "/api/wristband/plan",
        method: "POST",
        body: wristband,
        credentials: "include",
      }),
      invalidatesTags: ["wistband"],
    }),
    updateWristband: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/wristband/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["wistband"],
    }),
    updateWristbandItemStatus: builder.mutation({
      query: ({ id, wristband }) => ({
        url: `/api/wristband/item/status/${id}`,
        method: "PATCH",
        body: wristband,
      }),
      invalidatesTags: ["wistband", "update"],
    }),
    deleteWristband: builder.mutation({
      query: (id) => ({
        url: `/api/wristband/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["wistband"],
    }),
    deleteWristbandItem: builder.mutation({
      query: (id) => ({
        url: `/api/wristband/item/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["wistband", "update"],
    }),
  }),
});

export const {
  useGetAllWristbandQuery,
  useGetOneWristbandQuery,
  useUpdateWristbandMutation,
  useDeleteWristbandMutation,
  useCreateWristbandMutation,
  useCreatePlanWristbandMutation,
  useGetAllWristbandItemQuery,
  useGetOneWristbandItemQuery,
  useDeleteWristbandItemMutation,
  useUpdateWristbandItemStatusMutation,
  useGetOneWristbandItemByIdQuery,
  useGetAllWristbandItemModeQuery,
  useGetAllOrderedWristbandItemQuery,
} = wristbandApi;
