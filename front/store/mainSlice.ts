import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    seCategory(state, action) {
      state.category = true;
    },
  },
  extraReducers: {},
});

export const mainReducer = mainSlice.reducer;
