import { apiSlice } from "../../app/api";

export const partnerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPartner: builder.query({
      query: ({ page, limit, searchBy }) => ({
        url: `/api/partner?limit=${limit}&page=${page}&searchBy=${searchBy}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["partner"],
    }),
    getPlusibleData: builder.query({
      query: ({ landername, period }) => ({
        url: `/api/partner/plausible/${landername}?period=${period}`,
        method: "GET",
      }),
      providesTags: ["partner"],
    }),
    getOnePartner: builder.query({
      query: (id) => ({
        url: `/api/partner/${id}`,
        method: "GET",
      }),
      providesTags: ["partner"],
    }),
    createPartner: builder.mutation({
      query: (partner) => ({
        url: "/api/partner",
        method: "POST",
        body: partner,
      }),
      invalidatesTags: ["partner"],
    }),
    sendPartnerEmail: builder.mutation({
      query: (partner) => ({
        url: "/api/partner/send",
        method: "POST",
        body: partner,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["partner"],
    }),
    sendAskForHelpEmail: builder.mutation({
      query: (user) => ({
        url: "/api/partner/help/send",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["partner"],
    }),
    updatePartner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/partner/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["partner"],
    }),
    deletePartner: builder.mutation({
      query: (id) => ({
        url: `/api/partner/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["partner"],
    }),
  }),
});

export const {
  useGetAllPartnerQuery,
  useGetOnePartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  useSendPartnerEmailMutation,
  useGetPlusibleDataQuery,
  useSendAskForHelpEmailMutation,
} = partnerApi;
