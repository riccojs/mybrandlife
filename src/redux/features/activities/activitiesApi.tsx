import { apiSlice } from "../../app/api";

export const activitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllActivities: builder.query({
      query: ({ page, limit, searchBy, statusBy, methodBy }) => ({
        url: `/api/auth/admin/activities?limit=${limit}&page=${page}&searchBy=${searchBy}&statusBy=${statusBy}&methodBy=${methodBy}`,
        method: "GET",
      }),
      providesTags: ["contact"],
    }),
    getOneActivities: builder.query({
      query: (id) => ({
        url: `/api/auth/admin/activities/${id}`,
        method: "GET",
      }),
      providesTags: ["contact"],
    }),
    deleteActivities: builder.mutation({
      query: (id) => ({
        url: `/api/auth/admin/activities/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetAllActivitiesQuery,
  useGetOneActivitiesQuery,
  useDeleteActivitiesMutation,
} = activitiesApi;
