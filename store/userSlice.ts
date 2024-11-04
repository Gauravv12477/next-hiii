"use client";

// userSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    token: string | null;
    userInfo: any | null; 
}

const initialState: UserState = {
    token: null,
    userInfo: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; user: any }>) {
            state.token = action.payload.token;
            state.userInfo = action.payload.user;
            localStorage.setItem('token', action.payload.token)

        },
        logout(state) {
            state.token = null; 
            state.userInfo = null;
            localStorage.clear();

        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
