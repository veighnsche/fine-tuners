import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OpenAiFineTune } from '../models/openAI/FineTuning'

export interface FineTunesState {
  fineTunes: OpenAiFineTune[];
}

const initialState: FineTunesState = {
  fineTunes: [],
}

export const fineTunesSlice = createSlice({
  name: 'fineTunes',
  initialState,
  reducers: {
    setFineTunes: (state, action: PayloadAction<{
      fineTunes: OpenAiFineTune[]
    }>) => {
      state.fineTunes = action.payload.fineTunes
    },
  }
})

export const { setFineTunes } = fineTunesSlice.actions

export default fineTunesSlice.reducer