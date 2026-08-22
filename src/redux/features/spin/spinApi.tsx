import { apiSlice } from "../../app/api";

export const spinApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpining: builder.query({
      query: ({ page, limit, searchBy, landerId }) => ({
        url: `/api/spin?limit=${limit}&page=${page}&searchBy=${searchBy}&landerId=${landerId}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["spin"],
    }),
    getOneSpining: builder.query({
      query: (id) => ({
        url: `/api/spin/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["spin"],
    }),
    createSpining: builder.mutation({
      query: (spining) => ({
        url: "/api/spin",
        method: "POST",
        credentials: "include",
        body: spining,
      }),
      invalidatesTags: ["spin"],
    }),
    toggleSpin: builder.mutation({
      query: ({ id, spin }) => ({
        url: `/api/spin/toggle/${id}`,
        method: "PATCH",
        credentials: "include",
        body: spin,
      }),
      invalidatesTags: ["spin", "LoggedUser"],
    }),
    updateSpining: builder.mutation({
      query: ({ id, spining }) => ({
        url: `/api/spin/${id}`,
        method: "PATCH",
        credentials: "include",
        body: spining,
      }),
      invalidatesTags: ["spin"],
    }),
    deleteSpining: builder.mutation({
      query: (id) => ({
        url: `/api/spin/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["spin"],
    }),
  }),
});

export const {
  useGetAllSpiningQuery,
  useGetOneSpiningQuery,
  useToggleSpinMutation,
  useCreateSpiningMutation,
  useUpdateSpiningMutation,
  useDeleteSpiningMutation,
} = spinApi;
