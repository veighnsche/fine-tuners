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
    openDialog: (state, action: PayloadAction<{
      dialog: AppState['dialogOpen']
    }>) => {
      state.dialogOpen = action.payload.dialog
    },
    closeDialog: (state) => {
      state.dialogOpen = null
    },
    setEditTextFrom: (state, action: PayloadAction<{
      from: AppState['editTextFrom']
    }>) => {
      state.editTextFrom = action.payload.from
    },
  },
})

export const {
  openDialog,
  closeDialog,
  setEditTextFrom,
} = appSlice.actions

export default appSlice.reducer