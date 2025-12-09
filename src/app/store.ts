import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice'
import adminReducer from '../features/adminSlice'
import chatReducer from '../features/chatSlice'

export interface IRootState{
    users: Record<string,any>
    chat: {
        chats: any[]
    }
    admin: {
        adminData: any
        isLoading: boolean
    }
}

export const store = configureStore({reducer:{
    users: userReducer,
    admin: adminReducer,
    chat: chatReducer
}})
