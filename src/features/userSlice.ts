import { createSlice } from "@reduxjs/toolkit";


interface IInititalState {
    users: Record<string, any>[];
}

const initialState: IInititalState = {
    users: [],
};
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setApproveUser: (state, action) => {
            const index = state.users.findIndex((obj)=>obj?._id==action.payload);
            state.users[index].isVerified = true;
        },
    },
});

export const { setUsers,setApproveUser } = userSlice.actions;
export default userSlice?.reducer;
