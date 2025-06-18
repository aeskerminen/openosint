import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface datapointState {
  value: number
}

const initialState: datapointState = {
  value: 0,
}

export const datapointSlice = createSlice({
  name: 'datapoints',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = datapointSlice.actions

export const selectCount = (state: RootState) => state.datapoints.value

export default datapointSlice.reducer