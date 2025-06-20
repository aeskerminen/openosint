import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Datapoint } from "../types/datapoint";
import axios from "axios";
import { config } from "../config";
import type { RootState } from "../store";

interface datapointState {
  value: Array<Datapoint>;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

export const fetchDatapoints = createAsyncThunk(
  "datapoints/fetchDatapoints",
  async () => {
    const res = await axios.get<Datapoint[]>(
      config.API_BASE_URL + "/" + "datapoints"
    );

    console.log(res.data)
    return res.data;
  }
);

const initialState: datapointState = {
  value: [],
  status: "idle",
  error: null,
};

export const datapointSlice = createSlice({
  name: "datapoints",
  initialState,
  reducers: {
    add: (state, action) => {
      state.value.push(action.payload);
    },
    remove: (state, action) => {
      state.value = state.value.filter(
        (datapoint) => datapoint._id !== action.payload._id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatapoints.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchDatapoints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value.push(...action.payload);
      })
      .addCase(fetchDatapoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const { add, remove } = datapointSlice.actions;

export default datapointSlice.reducer;

export const selectAllDatapoints = (state : RootState) => state.datapoints.value;

export const selectDatapointsStatus = (state: RootState) => state.datapoints.status;
