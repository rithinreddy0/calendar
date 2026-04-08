import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

// Subscribe to store changes to save notes back to localStorage
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem('premium-cal-redux-notes', JSON.stringify(state.notes));
  } catch (err) {
    // Ignore write errors
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
