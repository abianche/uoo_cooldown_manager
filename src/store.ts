import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CooldownEntry, Cooldowns, GeneralSettings } from "./types";

interface CooldownState {
  data: Cooldowns | null;
  error: string | null;
}

const initialState: CooldownState = {
  data: null,
  error: null,
};

const cooldownSlice = createSlice({
  name: "cooldowns",
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

      // Ensure general settings exist
      if (!state.data.cooldowns.generalsettings) {
        state.data.cooldowns.generalsettings = {
          showCooldownGump: true,
          cooldownBarHeight: 20,
          cooldownBarWidth: 200,
        };
      }

      state.data.cooldowns.cooldownentry.push({
        name: "",
        defaultcooldown: 0,
        cooldownbartype: "Regular",
        hue: 0,
        hidewheninactive: true,
        trigger: [],
      });
    },
    updateEntry(
      state,
      action: PayloadAction<{ index: number; entry: CooldownEntry }>
    ) {
      if (!state.data) return;
      state.data.cooldowns.cooldownentry[action.payload.index] =
        action.payload.entry;
    },
    deleteEntry(state, action: PayloadAction<number>) {
      if (!state.data) return;
      state.data.cooldowns.cooldownentry.splice(action.payload, 1);
    },
    reorderEntries(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      if (!state.data) return;
      const { fromIndex, toIndex } = action.payload;
      const entries = [...state.data.cooldowns.cooldownentry];
      const [movedEntry] = entries.splice(fromIndex, 1);
      entries.splice(toIndex, 0, movedEntry);
      state.data.cooldowns.cooldownentry = entries;
    },
    updateGeneralSettings(
      state,
      action: PayloadAction<Partial<GeneralSettings>>
    ) {
      if (!state.data) return;
      state.data.cooldowns.generalsettings = {
        ...state.data.cooldowns.generalsettings,
        ...action.payload,
      };
    },
    initializeData(state) {
      if (!state.data) return;
      // Ensure general settings exist with defaults
      if (!state.data.cooldowns.generalsettings) {
        state.data.cooldowns.generalsettings = {
          showCooldownGump: true,
          cooldownBarHeight: 20,
          cooldownBarWidth: 200,
        };
      }
    },
  },
});

export const {
  setData,
  setError,
  addEntry,
  updateEntry,
  deleteEntry,
  reorderEntries,
  updateGeneralSettings,
  initializeData,
} = cooldownSlice.actions;

export const store = configureStore({
  reducer: {
    cooldowns: cooldownSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
