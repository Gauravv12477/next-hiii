import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  user: userReducer,
});

// Define persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persist only the `user` slice
};

// Wrap the combined rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Optional: Export `persistor` to handle store persistence in your app
export const persistor = persistStore(store);

// Type definitions for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
