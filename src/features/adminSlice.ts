import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminData {
    _id: string;
    email: string;
    name: string;
    phone?: number;
    role: string;
    isActive: boolean;
    isDeleted: boolean;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

interface AdminState {
    adminData: AdminData | null;
    isLoading: boolean;
}

const initialState: AdminState = {
    adminData: null,
    isLoading: false,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setAdminData: (state, action: PayloadAction<AdminData>) => {
            state.adminData = action.payload;
        },
        updateAdminData: (state, action: PayloadAction<Partial<AdminData>>) => {
            if (state.adminData) {
                state.adminData = { ...state.adminData, ...action.payload };
            }
        },
        clearAdminData: (state) => {
            state.adminData = null;
        },
        setAdminLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setAdminData, updateAdminData, clearAdminData, setAdminLoading } = adminSlice.actions;
export default adminSlice.reducer;

