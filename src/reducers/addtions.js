import { createSlice } from "@reduxjs/toolkit";

const additionsSlice = createSlice({
  name: 'additions',
  initialState: {
    additions: [],
    subtractions: [],
  },
  reducers: {
    addNumbers: (state, action) => {
      console.log('i am here');
      const expected = action.payload.number1 + action.payload.number2;
      const actual = parseInt(action.payload.answer, 10);
      state.additions.unshift({
        result: expected === actual,
        number1: action.payload.number1,
        number2: action.payload.number2,
        yourAnswer: action.payload.answer,
        correctAnswer: expected,
      });
    },
    subtractNumbers: (state, action) => {
      const expected = action.payload.number1 - action.payload.number2;
      const actual = parseInt(action.payload.answer, 10);
      state.subtractions.unshift({
        result: expected === actual,
        number1: action.payload.number1,
        number2: action.payload.number2,
        yourAnswer: action.payload.answer,
        correctAnswer: expected,
      });
    },
  },
});

export const { addNumbers, subtractNumbers } = additionsSlice.actions;

export default additionsSlice.reducer;