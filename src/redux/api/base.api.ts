import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../auth.token";

export const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

/**
 * One RTK Query API for the whole app. Feature files (bps.auth.api.ts, …)
 * add their endpoints with `baseApi.injectEndpoints`.
 *
 * - `credentials: "include"` so the browser sends and stores the httpOnly
 *   `bpsToken` cookie the backend sets on login.
 * - `x-api-key` is required by the backend's public routes (publicSecretAuth).
 * - `Authorization: Bearer` carries the same login token, for browsers that
 *   don't send the cookie back (see auth.token.ts).
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;
      if (apiKey) headers.set("x-api-key", apiKey);
      const token = getAuthToken();
      if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["BpsUser"],
  endpoints: () => ({}),
});

/** HTTP status of an RTK Query error, if it has one. */
export function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const { status } = error as { status: unknown };
    if (typeof status === "number") return status;
  }
  return undefined;
}

/** Backend errors look like `{ status: "Error", message: "..." }`. */
export function getApiError(error: unknown, fallback = "Something went wrong. Try again.") {
  if (error && typeof error === "object" && "status" in error) {
    const { status, data } = error as { status: unknown; data?: unknown };
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (status === "FETCH_ERROR") return "Can't reach the server. Check your connection and try again.";
  }
  return fallback;
}
