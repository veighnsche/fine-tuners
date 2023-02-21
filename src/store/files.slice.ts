import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LineType } from '../models/Line'
import { OpenAiFile } from '../models/openAI/Files'
import { RootState } from './index'

interface FilesState {
  files: OpenAiFile[];
  currentLines: LineType[] | null;
}

const initialState: FilesState = {
  files: [],
  currentLines: null,
}

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<{
      files: OpenAiFile[];
    }>) => {
      state.files = action.payload.files
    },
    unsetCurrentFile: (state) => {
      state.currentLines = null
    },
    setCurrentLines: (state, action: PayloadAction<{
      lines: LineType[];
    }>) => {
      state.currentLines = action.payload.lines
    },
    removeFile: (state, action: PayloadAction<{
      id: string;
    }>) => {
      state.files = state.files.filter(file => file.id !== action.payload.id)
    },
  },
})

export const {
  setFiles,
  unsetCurrentFile,
  setCurrentLines,
  removeFile,
} = filesSlice.actions

export const selectFinetuneFiles = (state: RootState) =>
  state.files.files.filter((file: OpenAiFile) => file.purpose === 'fine-tune')

export default filesSlice.reducer