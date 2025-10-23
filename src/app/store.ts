import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice'

export interface IRootState{
    users:Record<string,any>
}

export const store = configureStore({reducer:{
    users:userReducer
}})
