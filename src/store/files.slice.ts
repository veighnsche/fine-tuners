import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LineType } from "../models/Line";
import { OpenAiFile } from "../models/openAI/Files";

interface FilesState {
  files: OpenAiFile[];
  currentLines: LineType[] | null;
}

const initialState: FilesState = {
  files: [],
  currentLines: null,
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<{
      files: OpenAiFile[];
    }>) => {
      state.files = action.payload.files;
    },
    unsetCurrentFile: (state) => {
      state.currentLines = null;
    },
    setCurrentLines: (state, action: PayloadAction<{
      lines: LineType[];
    }>) => {
      state.currentLines = action.payload.lines;
    },
  },
});

export const {
  setFiles,
  unsetCurrentFile,
  setCurrentLines,
} = filesSlice.actions;

export default filesSlice.reducer;