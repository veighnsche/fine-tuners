import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OpenAiCreateCompletionParameters } from '../models/openAI/CreateCompletion'

export interface HistoryItemType {
  id: string
  completion: string
  createdAt: string
  params: OpenAiCreateCompletionParameters
}

export interface DocumentState {
  userId: string
  name: string
  openAiFileId: string
  history: HistoryItemType[]
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
    setDocumentName: (state, action: PayloadAction<{
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
      historyItem: HistoryItemType
    }>) => {
      state.history.push(action.payload.historyItem)
    },
    removeFromHistory: (state, action: PayloadAction<{
      id: string
    }>) => {
      state.history = state.history.filter(item => item.id !== action.payload.id)
    },
  },
})

export const {
  setUserId,
  setDocumentName,
  setOpenAiFileId,
  addHistoryItem,
  removeFromHistory,
} = documentSlice.actions

export default documentSlice.reducer