import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DocumentState {
  userId: string
  name: string
  openAiFileId: string
}

export const initialState: DocumentState = {
  userId: '',
  name: '',
  openAiFileId: '',
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
  },
})

export const {
  setUserId,
  setName,
  setOpenAiFileId,
} = documentSlice.actions

export default documentSlice.reducer