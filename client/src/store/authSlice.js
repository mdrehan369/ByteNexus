import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.user = action.payload;
            return state;
        },

        logout: (state) => {
            state.status = false;
            state.user = null
            return state;
        },

        addBookmark: (state, action) => {
            console.log(action.payload)
            if(action.payload.type === "add") {
                state.user.bookmarks.push(action.payload.data);
            }else{
                state.user.bookmarks.splice(state.user.bookmarks.indexOf(action.payload.data), 1);
            }
            return state;
        }
    }
});

export const { login, logout, addBookmark } = authSlice.actions;

export default authSlice.reducer;