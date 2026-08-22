import { apiSlice } from "../../app/api";

export const referralApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReferral: builder.query({
      query: ({ page, limit, searchBy, type, sort }) => ({
        url: `/api/referral?limit=${limit}&page=${page}&searchBy=${searchBy}&type=${type}&sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["referral"],
    }),
    getAllReferralUser: builder.query({
      query: ({ page, limit, searchBy, code }) => ({
        url: `/api/referral/user?limit=${limit}&page=${page}&searchBy=${searchBy}&code=${code}`,
        method: "GET",
      }),
      providesTags: ["referral"],
    }),
    getOneReferral: builder.query({
      query: (id) => ({
        url: `/api/referral/${id}`,
        method: "GET",
      }),
      providesTags: ["referral"],
    }),
    createReferral: builder.mutation({
      query: (formData) => ({
        url: "/api/referral",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["referral"],
    }),
    updateReferral: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/referral/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["referral"],
    }),
    deleteReferral: builder.mutation({
      query: (id) => ({
        url: `/api/referral/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["referral"],
    }),
  }),
});

export const {
  useGetAllReferralQuery,
  useGetOneReferralQuery,
  useCreateReferralMutation,
  useUpdateReferralMutation,
  useDeleteReferralMutation,
  useGetAllReferralUserQuery,
} = referralApi;
