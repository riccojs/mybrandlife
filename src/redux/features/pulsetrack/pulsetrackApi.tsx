import { apiSlice } from "../../app/api";

export const pulsetrackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPulsetrack: builder.query({
      query: ({ page, limit, statusBy, searchBy, userId, orderId }) => ({
        url: `/api/pulsetrack?limit=${limit}&page=${page}&statusBy=${statusBy}&searchBy=${searchBy}&userId=${userId}&orderId=${orderId}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["pulsetrack"],
    }),
    getAllExport: builder.query({
      query: ({ page, limit, userId }) => ({
        url: `/api/pulsetrack/export?limit=${limit}&page=${page}&userId=${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["pulsetrack"],
    }),
    getOnePulsetrack: builder.query({
      query: (id) => ({
        url: `/api/pulsetrack/${id}`,
        method: "GET",
      }),
      providesTags: ["wistbandCart", "pulsetrack"],
    }),
    getDefaultPulsetrack: builder.query({
      query: (id) => ({
        url: `/api/pulsetrack/default?userId=${id}`,
        method: "GET",
      }),
      providesTags: ["wistbandCart", "pulsetrack"],
    }),
    getPulsetrackCart: builder.query({
      query: (pulsetrackId) => ({
        url: `/api/pulsetrack/cart?pulsetrackId=${pulsetrackId}&modeBy=PULSETRACK`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["wistbandCart"],
    }),
    createPulsetrack: builder.mutation({
      query: (project) => ({
        url: "/api/pulsetrack",
        method: "POST",
        body: project,
        credentials: "include",
      }),
      invalidatesTags: ["pulsetrack"],
    }),
    createPulsetrackPayment: builder.mutation({
      query: (pulsetrack) => ({
        url: "/api/pulsetrack/payment",
        method: "POST",
        body: pulsetrack,
      }),
      invalidatesTags: ["pulsetrack"],
    }),
    findPulsetrack: builder.mutation({
      query: (project) => ({
        url: "/api/pulsetrack/check",
        method: "POST",
        body: project,
        credentials: "include",
      }),
    }),
    exportPulsetrack: builder.mutation({
      query: ({ id, pulsetrack }) => ({
        url: `/api/pulsetrack/export/${id}`,
        method: "POST",
        body: pulsetrack,
        credentials: "include",
        responseHandler: async (response) => response.blob(),
      }),
      invalidatesTags: ["pulsetrack"],
    }),
    updatePulsetrack: builder.mutation({
      query: ({ id, project }) => ({
        url: `/api/pulsetrack/${id}`,
        method: "PATCH",
        body: project,
      }),
      invalidatesTags: ["pulsetrack"],
    }),

    togglePulsetrack: builder.mutation({
      query: ({ id, projectData }) => ({
        url: `/api/pulsetrack/toggle/${id}`,
        method: "PATCH",
        body: projectData,
      }),
      invalidatesTags: ["wistbandCart"],
    }),
    togglePulsetrackExtra: builder.mutation({
      query: ({ id, pulsetrack }) => ({
        url: `/api/pulsetrack/extra/${id}`,
        method: "PATCH",
        body: pulsetrack,
      }),
      invalidatesTags: ["wistbandCart"],
    }),
    assignPulsetrackUser: builder.mutation({
      query: ({ id, wristband }) => ({
        url: `/api/pulsetrack/assigned/${id}`,
        method: "PATCH",
        body: wristband,
      }),
      invalidatesTags: ["pulsetrack"],
    }),
    deletePulsetrack: builder.mutation({
      query: (id) => ({
        url: `/api/pulsetrack/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["pulsetrack"],
    }),
    deletePulsetrackCartItem: builder.mutation({
      query: (id) => ({
        url: `/api/pulsetrack/cart/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["wistbandCart"],
    }),
  }),
});

export const {
  useGetAllPulsetrackQuery,
  useGetAllExportQuery,
  useGetOnePulsetrackQuery,
  useCreatePulsetrackMutation,
  useUpdatePulsetrackMutation,
  useDeletePulsetrackMutation,
  useFindPulsetrackMutation,
  useTogglePulsetrackMutation,
  useGetPulsetrackCartQuery,
  useDeletePulsetrackCartItemMutation,
  useTogglePulsetrackExtraMutation,
  useCreatePulsetrackPaymentMutation,
  useAssignPulsetrackUserMutation,
  useGetDefaultPulsetrackQuery,
  useExportPulsetrackMutation,
} = pulsetrackApi;
