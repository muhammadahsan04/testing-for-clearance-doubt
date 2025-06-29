// 12-may-2025
// import { configureStore } from '@reduxjs/toolkit';
// import permissionsReducer from './slices/permissionSlice';
// import rolesReducer from './slices/roleSlice';

// export const store = configureStore({
//   reducer: {
//     permissions: permissionsReducer,
//     roles: rolesReducer,
//   },
//   // Disable serializable check completely for now to rule out serialization issues
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import roleReducer from './slices/roleSlice';
import permissionReducer from './slices/permissionSlice';
// Import other reducers as needed

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['roles', 'permissions'], // Only persist these reducers
};

// Combine all reducers
const rootReducer = combineReducers({
  roles: roleReducer,
  permissions: permissionReducer,
  // Add other reducers here
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
