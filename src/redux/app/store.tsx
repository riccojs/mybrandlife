import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import { onboardSlice } from "../features/onboard/onboardSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    onboard: onboardSlice.reducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(apiSlice.middleware),
});

export default store;
