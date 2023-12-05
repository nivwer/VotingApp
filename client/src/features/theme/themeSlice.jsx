import { createSlice } from "@reduxjs/toolkit";

const initialState = { theme_color: localStorage.getItem("theme-color") || "default" };

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeColor: (state, action) => {
      state.theme_color = action.payload.theme_color;
    },
  },
});

export const { changeColor } = themeSlice.actions;
export default themeSlice.reducer;
