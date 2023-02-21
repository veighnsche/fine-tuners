import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  dialogOpen: 'name' | 'files' | 'finetunes' | null
  editTextFrom: 'history' | 'training' | null
}

export const initialState: AppState = {
  dialogOpen: null,
  editTextFrom: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleNameDialog: (state) => {
      state.dialogOpen = state.dialogOpen === 'name' ? null : 'name'
    },
    toggleFilesDialog: (state) => {
      state.dialogOpen = state.dialogOpen === 'files' ? null : 'files'
    },
    toggleFinetunesDialog: (state) => {
      state.dialogOpen = state.dialogOpen === 'finetunes' ? null : 'finetunes'
    },
    setEditTextFrom: (state, action: PayloadAction<{
      from: AppState['editTextFrom']
    }>) => {
      state.editTextFrom = action.payload.from
    },
  },
})

export const {
  toggleNameDialog,
  toggleFilesDialog,
  toggleFinetunesDialog,
  setEditTextFrom,
} = appSlice.actions

export default appSlice.reducer