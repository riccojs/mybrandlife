import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(apiSlice.middleware),
});

export default store;
