// src/store/expenseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// fetch all
export const fetchExpensesAsync = createAsyncThunk(
  "expenses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("fetching expenses");
      const res = await axios.get("/expenses");
      return res.data; // expect array of expenses
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

// add
export const addExpenseAsync = createAsyncThunk(
  "expenses/add",
  async (expenseData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/expenses/create", expenseData);
      return res.data; // expect created expense with id
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Add failed" });
    }
  }
);

// update
export const updateExpenseAsync = createAsyncThunk(
  "expenses/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // console.log(id , updates)
      const res = await axios.put(`/expenses/${id}`, updates);
      return res.data; // expect updated expense
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Update failed" });
    }
  }
);

// delete
export const deleteExpenseAsync = createAsyncThunk(
  "expenses/delete",
  async (expenseId, { rejectWithValue }) => {
    try {
      //  console.log(expenseId)
      await axios.delete(`/expenses/${expenseId}`);
      return expenseId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Delete failed" });
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    // local-only helpers if needed
    clearExpenses(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchExpensesAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExpensesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Fetch failed";
      })

      // ADD
      .addCase(addExpenseAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addExpenseAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // add to front
        state.items.unshift(action.payload);
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Add failed";
      })

      // UPDATE
      .addCase(updateExpenseAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateExpenseAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.items.findIndex(i => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateExpenseAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Update failed";
      })

      // DELETE
      .addCase(deleteExpenseAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(i => i._id !== action.payload);
      })
      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Delete failed";
      });
  }
});

export const { clearExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
