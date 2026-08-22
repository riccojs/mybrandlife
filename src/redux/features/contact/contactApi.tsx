import { apiSlice } from "../../app/api";

export const onboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContact: builder.query({
      query: ({ page, limit, searchBy, statusBy }) => ({
        url: `/api/contact?limit=${limit}&page=${page}&searchBy=${searchBy}&statusBy=${statusBy}`,
        method: "GET",
      }),
      providesTags: ["contact"],
    }),
    getOneContact: builder.query({
      query: (id) => ({
        url: `/api/contact/${id}`,
        method: "GET",
      }),
      providesTags: ["contact"],
    }),
    createContact: builder.mutation({
      query: (user) => ({
        url: "/api/contact",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["contact"],
    }),
    updateContact: builder.mutation({
      query: ({ id, user }) => ({
        url: `/api/contact/${id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["contact"],
    }),
    seenContact: builder.mutation({
      query: (id) => ({
        url: `/api/contact/status/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/api/contact/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetAllContactQuery,
  useGetOneContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useSeenContactMutation,
} = onboardApi;
