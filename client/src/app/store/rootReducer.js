import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { accountsAPISlice } from "../../api/accountsAPISlice";
import { pollsAPISlice } from "../../api/pollsAPISlice";

import { pollApiSlice } from "../../api/pollApiSlice";
import sessionReducer from "../../features/auth/sessionSlice";
import themeReducer from "../../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    accountsAPI: accountsAPISlice.reducer,
    pollsAPI: pollsAPISlice.reducer,

    pollsApi: pollApiSlice.reducer,
    session: sessionReducer,
    theme: themeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pollApiSlice.middleware)
      .concat(accountsAPISlice.middleware)
      .concat(pollsAPISlice.middleware),
});

setupListeners(store.dispatch);
