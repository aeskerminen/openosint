import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TextDatapoint } from "../types/textDatapoint";
import type { RootState } from "../store";
import textDatapointService from "../services/textDatapointService";

interface TextDatapointState {
  value: Array<TextDatapoint>;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

export const fetchTextDatapoints = createAsyncThunk(
  "textDatapoints/fetchTextDatapoints",
  async () => {
    const res = await textDatapointService.getTextDatapoints();
    return res.data;
  }
);

const initialState: TextDatapointState = {
  value: [],
  status: "idle",
  error: null,
};

export const textDatapointSlice = createSlice({
  name: "textDatapoints",
  initialState,
  reducers: {
    add: (state, action) => {
      state.value.push(action.payload);
    },
    update: (state, action) => {
      const index = state.value.findIndex(
        (datapoint) => datapoint._id === action.payload._id
      );
      if (index !== -1) {
        state.value[index] = {
          ...state.value[index],
          ...action.payload,
        };
      }
    },
    remove: (state, action) => {
      state.value = state.value.filter(
        (datapoint) => datapoint._id !== action.payload._id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTextDatapoints.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTextDatapoints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      })
      .addCase(fetchTextDatapoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const { add, update, remove } = textDatapointSlice.actions;

export default textDatapointSlice.reducer;

export const selectAllTextDatapoints = (state: RootState) =>
  state.textDatapoints.value;

export const selectTextDatapointsStatus = (state: RootState) =>
  state.textDatapoints.status;
