// Redux Toolkit config Reducers.
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
// API Reducers.
import { authApiSlice } from "../../api/authApiSlice";
// Reducers.
import authReducer from "../../features/auth/authSlice";

// Store.
export const store = configureStore({
  reducer: {
    // Queries for the backend authentication API.
    authApi: authApiSlice.reducer,
    // Session.
    session: authReducer, 
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

setupListeners(store.dispatch);
