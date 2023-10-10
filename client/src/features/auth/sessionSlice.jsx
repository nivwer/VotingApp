import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_loading: true,
  token: null,
  user: null,
  profile: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    // Action to login.
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.is_loading = false;
    },
    // Action to logout.
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.profile = null;
    },
    // Action to update profile.
    updateProfileAction: (state, action) => {
      state.profile = action.payload.profile;
    },
  },
});

export const { login, logout, updateProfileAction } = sessionSlice.actions;

export default sessionSlice.reducer;
