import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  isNameDialogOpen: boolean
  isFilesDialogOpen: boolean
  editTextFrom: 'history' | 'training' | null
}

export const initialState: AppState = {
  isNameDialogOpen: false,
  isFilesDialogOpen: false,
  editTextFrom: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleNameDialog: (state) => {
      state.isNameDialogOpen = !state.isNameDialogOpen
    },
    toggleFilesDialog: (state) => {
      state.isFilesDialogOpen = !state.isFilesDialogOpen
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
  setEditTextFrom,
} = appSlice.actions

export default appSlice.reducer