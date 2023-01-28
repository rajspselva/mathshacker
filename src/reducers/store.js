import { configureStore } from '@reduxjs/toolkit'
import addtionsReducer from './addtions'

export const store  = configureStore({
    reducer: {
        additions: addtionsReducer
    }
})