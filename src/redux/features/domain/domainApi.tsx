import { apiSlice } from "../../app/api";

export const domainApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDomain: builder.query({
      query: ({ page, limit, searchBy }) => ({
        url: `/api/domain?limit=${limit}&page=${page}&searchBy=${searchBy}`,
        method: "GET",
      }),
      providesTags: ["domain"],
    }),
    getOneDomain: builder.query({
      query: (id) => ({
        url: `/api/domain/${id}`,
        method: "GET",
      }),
      providesTags: ["domain"],
    }),
    deleteDomain: builder.mutation({
      query: (id) => ({
        url: `/api/domain/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["domain"],
    }),
  }),
});

export const {
  useGetAllDomainQuery,
  useGetOneDomainQuery,
  useDeleteDomainMutation,
} = domainApi;
