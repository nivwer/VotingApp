// Redux Toolkit config Reducers.
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
// API Reducers.
import { authApiSlice } from "../../api/authApiSlice";

// Reducers.

// Store.
export const store = configureStore({
  reducer: {
    // Queries for the backend authentication API.
    authApi: authApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

setupListeners(store.dispatch);
