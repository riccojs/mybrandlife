import { apiSlice } from "../../app/api";

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReport: builder.query({
      query: ({ page, limit }) => ({
        url: `/api/report?limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    getOneReport: builder.query({
      query: (id) => ({
        url: `/api/report/${id}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    createReport: builder.mutation({
      query: (referral) => ({
        url: "/api/report",
        method: "POST",
        body: referral,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["report"],
    }),
    updateReport: builder.mutation({
      query: ({ id, referral }) => ({
        url: `/api/report/${id}`,
        method: "PATCH",
        body: referral,
      }),
      invalidatesTags: ["report"],
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/api/report/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["report"],
    }),
  }),
});

export const {
  useGetAllReportQuery,
  useGetOneReportQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;
