import { configureStore } from "@reduxjs/toolkit";
import imageDatapointReducer from "./slices/imageDatapointSlice";
import textDatapointReducer from "./slices/textDatapointSlice";

export const store = configureStore({
  reducer: {
    imageDatapoints: imageDatapointReducer,
    textDatapoints: textDatapointReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
