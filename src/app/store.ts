import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice'
import adminReducer from '../features/adminSlice'

export interface IRootState{
    users: Record<string,any>
    admin: {
        adminData: any
        isLoading: boolean
    }
}

export const store = configureStore({reducer:{
    users: userReducer,
    admin: adminReducer
}})
