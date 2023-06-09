import { API_URL } from "@/http";
import { AuthService } from "@/services/AuthService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  category: false,
  user: {},
  isAuth: false,
};

export const registration = createAsyncThunk("app/registration", async ({ email, password }) => {
  try {
    const response = await AuthService.registration(email, password);
    // localStorage.setItem("token", response.data.token.accesstoken);

    return response;
  } catch (e) {
    console.log(e.response?.data?.message);
  }
});

export const login = createAsyncThunk("app/login", async ({ email, password }) => {
  try {
    const response = await AuthService.login(email, password);
    localStorage.setItem("token", response.data.token.accesstoken);
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e.response?.data?.message);
  }
});

export const checkAuth = createAsyncThunk("app/refresh", async () => {
  try {
    const response = await axios.get(`${API_URL}/refresh`, {
      withCredentials: true,
    });
    // console.log(response);
    localStorage.setItem("token", response.data.token.accesstoken);
    return response.data;
  } catch (e) {
    console.log(e.response?.data?.message);
  }
});

export const logout = createAsyncThunk("app/logout", async () => {
  const response = await AuthService.logout();
  localStorage.removeItem("token");
  return response.data;
});

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    changeIsAuth(state, action) {
      state.isAuth = false;
      console.log(state.category);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registration.fulfilled, (state, action) => {
      state.isAuth = true;
      state.user = action?.payload?.user;
    }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action?.payload?.user;
      }),
      builder.addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuth = action?.payload?.user ? true : false;
        state.user = action?.payload?.user;
      }),
      // builder.addCase(checkAuth.rejected, (state, action) => {
      //   state.isAuth = false;
      //   state.users = {};
      // }),
      builder.addCase(logout.fulfilled, (state, action) => {
        state.isAuth = false;
        state.user = {};
      });
  },
});

export const mainReducer = mainSlice.reducer;
