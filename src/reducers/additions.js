import { createSlice } from "@reduxjs/toolkit";

const additionsSlice = createSlice({
  name: 'additions',
  initialState: {
    additions: [],
    subtractions: [],
    twoAdditions: [],
    multiplications: []
  },
  reducers: {
    addTwoDigitNumbers: (state, action) => {
      const expected = action.payload.number1 + action.payload.number2;
      const actual = parseInt(action.payload.answer, 10);
      state.twoAdditions.unshift({
        result: expected === actual,
        number1: action.payload.number1,
        number2: action.payload.number2,
        yourAnswer: action.payload.answer,
        correctAnswer: expected,
      });
    },
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
    multiplicationNumbers: (state, action) => {
      const expected = action.payload.number1 * action.payload.number2;
      const actual = parseInt(action.payload.answer, 10);
      state.multiplications.unshift({
        result: expected === actual,
        number1: action.payload.number1,
        number2: action.payload.number2,
        yourAnswer: action.payload.answer,
        correctAnswer: expected,
      });
    },
    clearAdditionsQuestions: (state) => {
      state.additions = [];
    },
    clearTwoDigitAdditionsQuestions: (state) => {
      state.twoAdditions = [];
    },
    clearSubtractionsQuestions: (state) => {
      state.subtractions = [];
    },
    clearMultiplicationQuestions: (state) => {
      state.subtractions = [];
    },
  },
});

export const { addTwoDigitNumbers, addNumbers, subtractNumbers, multiplicationNumbers,
  clearAdditionsQuestions, clearSubtractionsQuestions, clearTwoDigitAdditionsQuestions, clearMultiplicationQuestions } = additionsSlice.actions;

export default additionsSlice.reducer;