// src/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import { toast } from "react-toastify";

// Async thunks
export const registerUserAsync = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post("/auth/register", formData);
      const { token, user } = res.data;
      if (token) localStorage.setItem("token", token);
      // Clear any cached expenses
      dispatch({ type: 'expenses/clearExpenses' });
      toast.success("Registration successful");
      return user;
    } catch (err) {
        toast.error(err.response?.data?.message);
      return rejectWithValue(err.response?.data || { message: "Registration failed" });
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post("/auth/login", formData);
      const { token, user } = res.data;
      if (token) localStorage.setItem("token", token);
      // Clear previous user's expenses
      dispatch({ type: 'expenses/clearExpenses' });
      toast.success("Login successful");
      return user;
    } catch (err) {
        toast.error(err.response?.data?.message);
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

export const fetchMeAsync = createAsyncThunk(
  "user/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/me");
      return res.data; // server should return user object
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch user" });
    }
  }
);

// initial state
const initialState = {
  user: null,
  isLoggedIn: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state, action) {
      // clear token and reset state
      localStorage.removeItem("token");
      state.user = null;
      state.isLoggedIn = false;
      state.status = "idle";
      state.error = null;
      // Clear expenses when logging out
      action.dispatch?.({ type: 'expenses/clearExpenses' });
    },
    // optional sync setter (if you want to set user from somewhere else)
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // register
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(fetchMeAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMeAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchMeAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Fetch user failed";
        // token invalid -> clear it
        localStorage.removeItem("token");
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
