import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LineType } from "../models/Line";
import { RootState } from "./index";

export interface LinesState {
  lines: LineType[];
}

export const initialState: LinesState = {
  lines: [],
};

export const linesSlice = createSlice({
  name: "lines",
  initialState,
  reducers: {
    setLines: (state, action: PayloadAction<{
      lines: LineType[]
    }>) => {
      state.lines = action.payload.lines;
    },
    newLine: (state) => {
      state.lines.push({
        prompt: "This is the prompt.",
        completion: "\n\nThis is the completion.",
      });
    },
    addLine: (state, action: PayloadAction<{
      line: Omit<LineType, "taught">
    }>) => {
      state.lines.push({
        ...action.payload.line,
        taught: 0,
      });
    },
    updateLine: (state, action: PayloadAction<{
      idx: number
      prompt: string
      completion: string
    }>) => {
      const { idx, prompt, completion } = action.payload;
      state.lines[idx].prompt = prompt;
      state.lines[idx].completion = completion;
    },
    incTaught: (state, action: PayloadAction<{
      idx: number
    }>) => {
      const taught = state.lines[action.payload.idx].taught || 0;
      state.lines[action.payload.idx].taught = taught + 1;
    },
  },
});

export const {
  setLines,
  newLine,
  addLine,
  updateLine,
  incTaught,
} = linesSlice.actions;

export const selectLinesForUpload = (state: RootState) => state.lines.lines.map((line) => {
  const { taught, ...rest } = line;
  return rest;
});

export default linesSlice.reducer;