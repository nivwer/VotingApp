import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
