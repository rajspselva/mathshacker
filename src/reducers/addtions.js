import { createSlice } from "@reduxjs/toolkit";

const additionsSlice = createSlice({
    name: "additions",
    initialState: {},
    reducers: {
        addNumbers: (state, payload) => {
            console.log(state)
            console.log(payload)
        }
    }
})

export const { addNumbers } = additionsSlice.actions;

export default additionsSlice.reducer;