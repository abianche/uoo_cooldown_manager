import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cooldowns, CooldownEntry } from './types';

interface CooldownState {
  data: Cooldowns | null;
  error: string | null;
}

const initialState: CooldownState = {
  data: null,
  error: null,
};

const cooldownSlice = createSlice({
  name: 'cooldowns',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Cooldowns>) {
      state.data = action.payload;
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    addEntry(state) {
      if (!state.data) return;
      state.data.cooldowns.cooldownentry.push({
        name: '',
        defaultcooldown: 0,
        cooldownbartype: 'Regular',
        hue: 0,
        hidewheninactive: true,
        trigger: [],
      });
    },
    updateEntry(state, action: PayloadAction<{ index: number; entry: CooldownEntry }>) {
      if (!state.data) return;
      state.data.cooldowns.cooldownentry[action.payload.index] = action.payload.entry;
    },
    deleteEntry(state, action: PayloadAction<number>) {
      if (!state.data) return;
      state.data.cooldowns.cooldownentry.splice(action.payload, 1);
    },
  },
});

export const { setData, setError, addEntry, updateEntry, deleteEntry } = cooldownSlice.actions;

export const store = configureStore({
  reducer: {
    cooldowns: cooldownSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
