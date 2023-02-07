import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LineType } from '../models/Line'

export interface LinesState {
  lines: LineType[]
}

export const initialState: LinesState = {
  lines: [{
    prompt: 'This is the prompt.',
    completion: '\n\nThis is the completion.',
  }],
}

export const linesSlice = createSlice({
  name: 'lines',
  initialState,
  reducers: {
    setLines: (state, action: PayloadAction<{
      lines: LineType[]
    }>) => {
      state.lines = action.payload.lines
    },
    newLine: (state) => {
      state.lines.push({
        prompt: 'This is the prompt.',
        completion: '\n\nThis is the completion.',
      })
    },
    updateLine: (state, action: PayloadAction<{
      idx: number
      prompt: string
      completion: string
    }>) => {
      const { idx, prompt, completion } = action.payload
      state.lines[idx].prompt = prompt
      state.lines[idx].completion = completion
    },
    incTaught: (state, action: PayloadAction<{
      idx: number
    }>) => {
      const taught = state.lines[action.payload.idx].taught || 0
      state.lines[action.payload.idx].taught = taught + 1
    },
  },
})

export const {
  setLines,
  newLine,
  updateLine,
  incTaught,
} = linesSlice.actions

export default linesSlice.reducer