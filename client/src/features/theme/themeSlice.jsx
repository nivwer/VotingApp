import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  available_theme_colors: [
    "default",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "cyan",
    "blue",
    "purple",
    "pink",
  ],
  theme_color: "default",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeColor: (state, action) => {
      if (state.available_theme_colors.includes(action.payload.theme_color)) {
        state.theme_color = action.payload.theme_color;
      }
    },
  },
});

export const { changeColor } = themeSlice.actions;

export default themeSlice.reducer;
