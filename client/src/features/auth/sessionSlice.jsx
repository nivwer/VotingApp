import { createSlice } from "@reduxjs/toolkit";

const initialState = { isAuthenticated: false, user: null, profile: null, csrftoken: null };

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.csrftoken = action.payload.csrftoken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.profile = null;
      state.csrftoken = null;
    },
    updateUserAction: (state, action) => (state.user = action.payload.user),
    updateProfileAction: (state, action) => (state.profile = action.payload.profile),
  },
});

export const { login, logout, updateUserAction, updateProfileAction } = sessionSlice.actions;
export default sessionSlice.reducer;
