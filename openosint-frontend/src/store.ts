import { configureStore } from '@reduxjs/toolkit'
import datapointReducer from './slices/datapointSlice'

export const store = configureStore({
    reducer: {
        datapoints: datapointReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch