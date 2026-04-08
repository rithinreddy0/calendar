import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: string; // The range key, e.g. "2026-04-10_2026-04-15"
  title: string;
  text: string;
  timeLabel: string;
}

interface NotesState {
  records: Record<string, Note>;
}

const loadState = (): NotesState => {
  try {
    const serializedState = localStorage.getItem('premium-cal-redux-notes');
    if (serializedState === null) {
      return { records: {} };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { records: {} };
  }
};

const initialState: NotesState = loadState();

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    saveNote: (state, action: PayloadAction<Note>) => {
      state.records[action.payload.id] = action.payload;
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      delete state.records[action.payload];
    }
  }
});

export const { saveNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
