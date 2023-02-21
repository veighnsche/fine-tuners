import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OpenAiFinetune } from '../models/openAI/FineTuning'

export interface FinetunesState {
  finetunes: OpenAiFinetune[];
}

const initialState: FinetunesState = {
  finetunes: [],
}

export const finetunesSlice = createSlice({
  name: 'finetunes',
  initialState,
  reducers: {
    setFinetunes: (state, action: PayloadAction<{
      finetunes: OpenAiFinetune[]
    }>) => {
      state.finetunes = action.payload.finetunes
    },
  },
})

export const { setFinetunes } = finetunesSlice.actions

export default finetunesSlice.reducer