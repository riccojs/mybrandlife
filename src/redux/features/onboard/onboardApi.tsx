import { apiSlice } from "../../app/api";

export const onboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOneOnboard: builder.query({
      query: ({ name, domain }) => ({
        url: `/api/onboard/wirframe/${name}?domain=${domain}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["update"],
    }),
    requestInfo: builder.mutation({
      query: (user) => ({
        url: "/api/onboard/request/info",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["update"],
    }),
    requestInfoLocation: builder.mutation({
      query: (data) => ({
        url: "/api/onboard/request/info/location",
        method: "POST",
        body: data,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["update"],
    }),
    checkDiscount: builder.mutation({
      query: (user) => ({
        url: "/api/onboard/discount",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
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
  }),
});

export const {
  useGetOneOnboardQuery,
  useOnboardUserMutation,
  useCheckDiscountMutation,
  useRequestInfoMutation,
  useRequestInfoLocationMutation,
} = onboardApi;
