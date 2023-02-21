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
    removeFinetune: (state, action: PayloadAction<{
      id: string
    }>) => {
      state.finetunes = state.finetunes.filter(f => f.id !== action.payload.id)
    }
  },
})

export const {
  setFinetunes,
  removeFinetune,
} = finetunesSlice.actions

export default finetunesSlice.reducer