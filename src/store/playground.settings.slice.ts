import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OpenAiCreateCompletionParameters } from '../models/openAI/CreateCompletion'
import { RootState } from './index'

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
} = playgroundSettingsSlice.actions

export const selectPlaygroundSettings = (state: RootState): OpenAiCreateCompletionParameters => ({
  model: state.playgroundSettings.model,
  temperature: state.playgroundSettings.temperature,
  max_tokens: state.playgroundSettings.maxTokens,
  stop: state.playgroundSettings.stopSequences,
  top_p: state.playgroundSettings.topP,
  frequency_penalty: state.playgroundSettings.frequencyPenalty,
  presence_penalty: state.playgroundSettings.presencePenalty,
  best_of: state.playgroundSettings.bestOf,
})

export default playgroundSettingsSlice.reducer