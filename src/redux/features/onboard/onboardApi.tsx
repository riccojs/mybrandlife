import { apiSlice } from "../../app/api";

export const onboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOnboard: builder.query({
      query: ({ page, limit, searchBy, status, userId }) => ({
        url: `/api/onboard?limit=${limit}&page=${page}&searchBy=${searchBy}&status=${status}&userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["update"],
    }),
    getOneOnboard: builder.query({
      query: ({ name, domain }) => ({
        url: `/api/onboard/wirframe/${name}?domain=${domain}`,
        method: "GET",
      }),
      providesTags: ["update"],
    }),
    requestInfo: builder.mutation({
      query: (user) => ({
        url: "/api/onboard/request/info",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["update"],
    }),
    requestInfoLocation: builder.mutation({
      query: (data) => ({
        url: "/api/onboard/request/info/location",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["update"],
    }),
    checkDiscount: builder.mutation({
      query: (user) => ({
        url: "/api/onboard/discount",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["update"],
    }),
    onboardUser: builder.mutation({
      query: (formData) => ({
        url: "/api/onboard",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["update"],
    }),
    recreatePayment: builder.mutation({
      query: (id) => ({
        url: `/api/onboard/recreate/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["update"],
    }),
    updatePayment: builder.mutation({
      query: (user) => ({
        url: "/api/onboard/update/payment",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["update"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/onboard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["update"],
    }),
  }),
});

export const {
  useGetAllOnboardQuery,
  useGetOneOnboardQuery,
  useDeleteUserMutation,
  useOnboardUserMutation,
  useCheckDiscountMutation,
  useRequestInfoMutation,
  useUpdatePaymentMutation,
  useRecreatePaymentMutation,
  useRequestInfoLocationMutation,
} = onboardApi;
