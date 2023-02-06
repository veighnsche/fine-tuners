import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './index'

export interface DocumentState {
  encryptedApiKey: string
  encryptedPassword: string
  name: string
  openAiFileId: string
}

export const initialState: DocumentState = {
  encryptedApiKey: '',
  encryptedPassword: '',
  name: '',
  openAiFileId: '',
}

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setEncryptedApiKey: (state, action: PayloadAction<{
      encryptedApiKey: string
    }>) => {
      state.encryptedApiKey = action.payload.encryptedApiKey
    },
    setPassword: (state, action: PayloadAction<{
      password: string
    }>) => {
      // todo: encrypt password
      state.encryptedPassword = action.payload.password
    },
    encryptApiKey(state, action: PayloadAction<{
      apiKey: string
      password: string
    }>) {
      // todo: encrypt password
      // todo: encrypt API key with encrypted password
      // for now, just store the unencrypted API key
      state.encryptedApiKey = action.payload.apiKey
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
  setEncryptedApiKey,
  setPassword,
  encryptApiKey,
  setName,
  setOpenAiFileId,
} = documentSlice.actions

export const selectApiKey = (state: RootState) => {
  // todo: decrypt API key with encrypted password
  // for now, just return the unencrypted API key
  return state.document.encryptedApiKey
}

export default documentSlice.reducer