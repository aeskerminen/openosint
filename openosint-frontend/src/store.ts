import { configureStore } from "@reduxjs/toolkit";
import imageDatapointReducer from "./slices/imageDatapointSlice";

export const store = configureStore({
  reducer: {
    imageDatapoints: imageDatapointReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
