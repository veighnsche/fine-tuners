import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlaygroundSettingsState {
  isOpen: boolean;
  model: string;
  modelOptions: string[];
  temperature: number;
  maxTokens: number;
  stopSequences: string[];
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  bestOf: number;
  injectStartText: boolean;
  injectedStartText: string;
  injectRestartText: boolean;
  injectedRestartText: string;
}

const initialState: PlaygroundSettingsState = {
  isOpen: true,
  model: 'davinci',
  modelOptions: ['davinci', 'curie', 'babbage', 'ada'],
  temperature: 0.7,
  maxTokens: 256,
  stopSequences: [],
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  bestOf: 1,
  injectStartText: true,
  injectedStartText: '',
  injectRestartText: true,
  injectedRestartText: '',
};

export const playgroundSettingsSlice = createSlice({
  name: 'playgroundSettings',
  initialState,
  reducers: {
    setPlaygroundSettingsOpen: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      state.isOpen = action.payload.isOpen;
    },
    setModel: (state, action: PayloadAction<{ model: string }>) => {
      state.model = action.payload.model;
    },
    setTemperature: (state, action: PayloadAction<{ temperature: number }>) => {
      state.temperature = action.payload.temperature;
    },
    setMaxTokens: (state, action: PayloadAction<{ maxTokens: number }>) => {
      state.maxTokens = action.payload.maxTokens;
    },
    setStopSequences: (state, action: PayloadAction<{ stopSequences: string[] }>) => {
      state.stopSequences = action.payload.stopSequences;
    },
    setTopP: (state, action: PayloadAction<{ topP: number }>) => {
      state.topP = action.payload.topP;
    },
    setFrequencyPenalty: (state, action: PayloadAction<{ frequencyPenalty: number }>) => {
      state.frequencyPenalty = action.payload.frequencyPenalty;
    },
    setPresencePenalty: (state, action: PayloadAction<{ presencePenalty: number }>) => {
      state.presencePenalty = action.payload.presencePenalty;
    },
    setBestOf: (state, action: PayloadAction<{ bestOf: number }>) => {
      state.bestOf = action.payload.bestOf;
    },
    setInjectStartText: (state, action: PayloadAction<{ injectStartText: boolean }>) => {
      state.injectStartText = action.payload.injectStartText;
    },
    setInjectedStartText: (state, action: PayloadAction<{ injectedStartText: string }>) => {
      state.injectedStartText = action.payload.injectedStartText;
    },
    setInjectRestartText: (state, action: PayloadAction<{ injectRestartText: boolean }>) => {
      state.injectRestartText = action.payload.injectRestartText;
    },
    setInjectedRestartText: (state, action: PayloadAction<{ injectedRestartText: string }>) => {
      state.injectedRestartText = action.payload.injectedRestartText;
    },
  }
})

export const {
  setPlaygroundSettingsOpen,
  setModel,
  setTemperature,
  setMaxTokens,
  setStopSequences,
  setTopP,
  setFrequencyPenalty,
  setPresencePenalty,
  setBestOf,
  setInjectStartText,
  setInjectedStartText,
  setInjectRestartText,
  setInjectedRestartText,
} = playgroundSettingsSlice.actions

export default playgroundSettingsSlice.reducer