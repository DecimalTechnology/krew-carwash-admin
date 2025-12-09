import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface IInitialState {
  chats: any[];
  selectedChat: any;
}

const initialState: IInitialState = {
  chats: [],
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    
  },
});

export const { setChats, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
