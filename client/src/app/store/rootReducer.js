// Redux Toolkit config Reducers.
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
// API Reducers.
import { authApiSlice } from "../../api/authApiSlice";
import { pollApiSlice } from "../../api/pollApiSlice";
// Reducers.
import authReducer from "../../features/auth/authSlice";
import themeReducer from "../../features/theme/themeSlice";

// Store.
export const store = configureStore({
  reducer: {
    // Requests for the backend authentication API.
    authApi: authApiSlice.reducer,
    // Request for the backend polls API.
    pollsApi: pollApiSlice.reducer,
    // Session.
    session: authReducer,
    // Theme Color.
    theme: themeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(pollApiSlice.middleware),
});

setupListeners(store.dispatch);
