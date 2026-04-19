import { apiSlice } from "../../app/api";

export const spinApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpinGroup: builder.query({
      query: ({ page, limit, searchBy, landerId }) => ({
        url: `/api/spin/group?limit=${limit}&page=${page}&searchBy=${searchBy}&landerId=${landerId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["spin"],
    }),
    getOneSpinGroup: builder.query({
      query: (id) => ({
        url: `/api/spin/group/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["spin"],
    }),
    getOneSpinGroupItem: builder.query({
      query: (id) => ({
        url: `/api/spin/group/item/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["spin"],
    }),

    createSpinGroup: builder.mutation({
      query: (group) => ({
        url: "/api/spin/group",
        method: "POST",
        credentials: "include",
        body: group,
      }),
      invalidatesTags: ["spin"],
    }),
    createSpinUser: builder.mutation({
      query: (group) => ({
        url: "/api/spin/group/item",
        method: "POST",
        credentials: "include",
        body: group,
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

    updateSpinUser: builder.mutation({
      query: ({ id, group }) => ({
        url: `/api/spin/group/item/${id}`,
        method: "PATCH",
        credentials: "include",
        body: group,
      }),
      invalidatesTags: ["spin"],
    }),
    deleteSpinUser: builder.mutation({
      query: (id) => ({
        url: `/api/spin/group/item/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["spin"],
    }),
    deleteSpin: builder.mutation({
      query: (id) => ({
        url: `/api/spin/group/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["spin"],
    }),
  }),
});

export const {
  useGetAllSpinGroupQuery,
  useGetOneSpinGroupQuery,
  useToggleSpinMutation,
  useCreateSpinGroupMutation,
  useCreateSpinUserMutation,
  useGetOneSpinGroupItemQuery,
  useUpdateSpinUserMutation,
  useDeleteSpinUserMutation,
  useDeleteSpinMutation,
} = spinApi;
