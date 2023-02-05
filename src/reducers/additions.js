import { createSlice } from "@reduxjs/toolkit";

const additionsSlice = createSlice({
  name: 'additions',
  initialState: {
    additions: [],
    subtractions: [],
  },
  reducers: {
    addNumbers: (state, action) => {
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
    clearAddtionsQuestions: (state) => {
      console.log('clearAddtionsQuestions');
      state.additions = [];
    },
    clearSubtractionsQuestions: (state) => {
      console.log('clearAddtionsQuestions');
      state.subtractions = [];
    },
  },
});

export const { addNumbers, subtractNumbers, clearAddtionsQuestions, clearSubtractionsQuestions } = additionsSlice.actions;

export default additionsSlice.reducer;