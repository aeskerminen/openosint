import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Datapoint } from "../types/datapoint";
import type { RootState } from "../store";
import imageDatapointService from "../services/imageDatapointService";

interface imageDatapointState {
  value: Array<Datapoint>;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

export const fetchImageDatapoints = createAsyncThunk(
  "imageDatapoints/fetchImageDatapoints",
  async () => {
    const res = await imageDatapointService.getImageDatapoints();

    console.log(res.data);
    return res.data;
  }
);

const initialState: imageDatapointState = {
  value: [],
  status: "idle",
  error: null,
};

export const imageDatapointSlice = createSlice({
  name: "imageDatapoints",
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
      .addCase(fetchImageDatapoints.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchImageDatapoints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value.push(...action.payload);
      })
      .addCase(fetchImageDatapoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const { add, update, remove } = imageDatapointSlice.actions;

export default imageDatapointSlice.reducer;

export const selectAllImageDatapoints = (state: RootState) => state.imageDatapoints.value;

export const selectImageDatapointsStatus = (state: RootState) =>
  state.imageDatapoints.status;
