import { configureStore } from '@reduxjs/toolkit'
import addtionsReducer from './additions'

export const store  = configureStore({
    reducer: {
        maths: addtionsReducer
    }
})