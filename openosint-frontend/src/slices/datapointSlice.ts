import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Datapoint } from '../types/datapoint'

interface datapointState {
    value: Array<Datapoint>
}

const initialState: datapointState = {
    value: [],
}

export const datapointSlice = createSlice({
    name: 'datapoints',
    initialState,
    reducers: {
        add: (state, action) => {
            state.value.push(action.payload)
        },
        remove: (state, action) => {
            state.value = state.value.filter((datapoint) => datapoint.id !== action.payload.id)
        },

    },
})

export const { add, remove } = datapointSlice.actions

export const selectCount = (state: RootState) => state.datapoints.value

export default datapointSlice.reducer