import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  profile: null,
};

export const authSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.profile = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
