import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OpenAiCreateCompletionParameters } from '../models/openAI/CreateCompletion'

export interface HistoryItem {
  id: string
  completion: string
  createdAt: string
  params: OpenAiCreateCompletionParameters
}

export interface DocumentState {
  userId: string
  name: string
  openAiFileId: string
  history: HistoryItem[]
}

export const initialState: DocumentState = {
  userId: '',
  name: '',
  openAiFileId: '',
  history: [],
}

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<{
      userId: string
    }>) => {
      state.userId = action.payload.userId
    },
    setName: (state, action: PayloadAction<{
      name: string
    }>) => {
      state.name = action.payload.name
    },
    setOpenAiFileId: (state, action: PayloadAction<{
      openAiFileId: string
    }>) => {
      state.openAiFileId = action.payload.openAiFileId
    },
    addHistoryItem: (state, action: PayloadAction<{
      historyItem: HistoryItem
    }>) => {
      state.history.push(action.payload.historyItem)
    },

  },
})

export const {
  setUserId,
  setName,
  setOpenAiFileId,
  addHistoryItem,
} = documentSlice.actions

export default documentSlice.reducer