import { createSlice } from "@reduxjs/toolkit";

const initialState = { isAuthenticated: false, token: null, user: null, profile: null };

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.profile = null;
    },
    updateUserAction: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateProfileAction: (state, action) => {
      state.profile = action.payload.profile;
    },
  },
});

export const { login, logout, updateUserAction, updateProfileAction } = sessionSlice.actions;
export default sessionSlice.reducer;
