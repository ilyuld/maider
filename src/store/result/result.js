import { createSlice } from "@reduxjs/toolkit";

export const Result = createSlice({
    name: "Result",
    initialState: {},
    reducers: {
        setValue: (state, action) => {
            state[action.payload.key] = action.payload.value
        }
    }
})

export default Result.reducer