import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    issueReportsCount: 0,
};
const issueReportsSlice = createSlice({
    name: "issuReports",
    initialState,
    reducers: {
        setIssueReportsCount: (state, action) => {
            state.issueReportsCount = action.payload;
        },
    },
});

export const { setIssueReportsCount } = issueReportsSlice.actions;
export default issueReportsSlice?.reducer;
