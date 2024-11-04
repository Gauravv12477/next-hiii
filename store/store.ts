// store.ts
"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'; // Correctly import the user slice reducer

export const store = configureStore({
  reducer: {
    user: userReducer, // Name the slice as 'user' or whatever you prefer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
