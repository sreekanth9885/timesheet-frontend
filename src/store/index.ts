// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer from "../features/auth/authSlice";
import { timesheetApi } from "../services/timesheetApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [timesheetApi.reducerPath]: timesheetApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(timesheetApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
