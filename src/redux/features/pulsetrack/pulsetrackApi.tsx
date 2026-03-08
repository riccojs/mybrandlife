import { apiSlice } from "../../app/api";

export const pulsetrackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    scanPulsetrack: builder.mutation({
      query: ({ id, pulsetrack }) => ({
        url: `/api/pulsetrack/scan/${id}`,
        method: "POST",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
        body: pulsetrack,
      }),
    }),
    scanGpsPulsetrack: builder.mutation({
      query: ({ id, pulsetrack }) => ({
        url: `/api/pulsetrack/scan/gps/${id}`,
        method: "POST",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
        body: pulsetrack,
      }),
    }),
  }),
});

export const { useScanPulsetrackMutation, useScanGpsPulsetrackMutation } =
  pulsetrackApi;
