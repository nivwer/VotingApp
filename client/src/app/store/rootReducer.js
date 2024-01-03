import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { accountsAPISlice } from "../../api/accountsAPISlice";
import { pollsAPISlice } from "../../api/pollsAPISlice";

import { authApiSlice } from "../../api/authApiSlice";
import { pollApiSlice } from "../../api/pollApiSlice";
import { profileApiSlice } from "../../api/profileApiSlice";
import sessionReducer from "../../features/auth/sessionSlice";
import themeReducer from "../../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    accountsAPI: accountsAPISlice.reducer,
    pollsAPI: pollsAPISlice.reducer,

    authApi: authApiSlice.reducer,
    pollsApi: pollApiSlice.reducer,
    profileApi: profileApiSlice.reducer,
    session: sessionReducer,
    theme: themeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(pollApiSlice.middleware)
      .concat(profileApiSlice.middleware)
      .concat(accountsAPISlice.middleware)
      .concat(pollsAPISlice.middleware),
});

setupListeners(store.dispatch);
