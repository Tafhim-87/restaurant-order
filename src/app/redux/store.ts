import { configureStore, combineReducers } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

const persistedState = loadState();

// Single store declaration
const rootReducer = combineReducers({
  orders: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState, // Add persisted state here
});

// Save state to localStorage
store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState());
    localStorage.setItem('reduxState', serializedState);
  } catch {
    // ignore errors
    console.error('Could not save state to localStorage');
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;