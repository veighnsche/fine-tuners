import { createSlice } from "@reduxjs/toolkit";

export interface DialogsState {
  isNameDialogOpen: boolean
  isFilesDialogOpen: boolean
}

export const initialState: DialogsState = {
  isNameDialogOpen: false,
  isFilesDialogOpen: false,
}

export const dialogsSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    toggleNameDialog: (state) => {
      state.isNameDialogOpen = !state.isNameDialogOpen
    },
    toggleFilesDialog: (state) => {
      state.isFilesDialogOpen = !state.isFilesDialogOpen
    },
  }
})

export const { toggleNameDialog, toggleFilesDialog } = dialogsSlice.actions

export default dialogsSlice.reducer