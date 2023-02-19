import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { LineType } from '../models/Line'
import { RootState } from './index'

export interface LinesState {
  lines: LineType[];
}

export const initialState: LinesState = {
  lines: [],
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
        id: uuid(),
        prompt: 'This is the prompt ###',
        completion: 'This is the completion. END',
      })
    },
    addLine: (state, action: PayloadAction<{
      line: Omit<LineType, 'taught'>
    }>) => {
      state.lines.push({
        ...action.payload.line,
        taught: 0,
      })
    },
    addLines: (state, action: PayloadAction<{
      lines: Omit<LineType, 'taught'>[]
    }>) => {
      const lines = action.payload.lines.map((line) => ({
        ...line,
        taught: 0,
      }))
      state.lines.push(...lines)
    },
    updateLine: (state, action: PayloadAction<{
      id: string
      prompt: string
      completion: string
    }>) => {
      const { id, prompt, completion } = action.payload
      const line = state.lines.find((line) => line.id === id)
      if (line) {
        line.prompt = prompt
        line.completion = completion
      }
    },
    incTaught: (state, action: PayloadAction<{
      idx: number
    }>) => {
      const taught = state.lines[action.payload.idx].taught || 0
      state.lines[action.payload.idx].taught = taught + 1
    },
    removeLine: (state, action: PayloadAction<{
      id: string
    }>) => {
      state.lines = state.lines.filter((line) => line.id !== action.payload.id)
    },
  },
})

export const {
  setLines,
  newLine,
  addLine,
  addLines,
  updateLine,
  incTaught,
  removeLine,
} = linesSlice.actions

export const selectLinesForUpload = (state: RootState) => state.lines.lines.map((line) => {
  const { taught, ...rest } = line
  return rest
})

export default linesSlice.reducer