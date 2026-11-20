import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import adminReducer from '../features/admin/adminSlice.ts';
import { baseApi } from '../features/api/baseApi.ts';
import modelsFilterReducer from '../features/models/modelsSlice.ts';
import uiReducer from '../features/ui/uiSlice.ts';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    modelsFilter: modelsFilterReducer,
    ui: uiReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
