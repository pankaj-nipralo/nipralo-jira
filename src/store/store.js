import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import taskReducer from './taskSlice';
import sprintReducer from './sprintSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

/**
 * Create a new Redux store instance
 *
 * This function is used by the StoreProvider to create a new store instance
 * for each request in a Next.js app with App Router.
 *
 * @returns {Object} The configured Redux store
 */
export function makeStore() {
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      tasks: taskReducer,
      sprints: sprintReducer,
      // Add more reducers here as your application grows
    },
    // Adding custom middleware
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Serializable check is useful for debugging but can be disabled in production
        serializableCheck: {
          // Ignore these action types (useful for non-serializable data like Dates)
          ignoredActions: [
            'tasks/setDueDate',
            'sprints/createSprint/fulfilled',
            'sprints/updateSprint/fulfilled',
            'sprints/startSprint/fulfilled',
            'sprints/completeSprint/fulfilled'
          ],
        },
      }),
    // Enable Redux DevTools in development
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
  // If you use RTK Query, this sets up listeners for invalidation actions
  setupListeners(store.dispatch);

  return store;
}

// We'll create the store instance in the StoreProvider component
// This ensures we have a single store instance across the app