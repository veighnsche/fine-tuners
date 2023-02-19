import { alpha, Box, Button, ButtonGroup, ImageList, ImageListItem, useTheme } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { addLines } from '../store/lines.slice'

export const FileContents = () => {
  const theme = useTheme()
  const lines = useAppSelector(state => state.files.currentLines)
  const [selected, setSelected] = useState<number[]>([])
  const dispatch = useAppDispatch()

  if (!lines) return null

  const handleAddToTrainingData = () => {
    if (!lines) return
    const newLines = lines.filter((_, idx) => selected.includes(idx))
    dispatch(addLines({ lines: newLines }))
  }

  const handleSelectAll = () => {
    if (!lines) return
    if (selected.length === lines.length) {
      setSelected([])
    }
    else {
      setSelected(lines.map((_, idx) => idx))
    }
  }

  const handleLineClick = (idx: number) => {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx))
    }
    else {
      setSelected([...selected, idx])
    }
  }


  return (
    <Box display="flex" flexDirection="column" width="66%" height="100%">
      <Box width="100%" height="100%" overflow="auto">
        <ImageList variant="masonry" cols={2} gap={8}>
          {lines.map((item, idx) => (
            <ImageListItem key={idx}>
              <Box
                border={`1px solid ${selected.includes(idx) ? theme.palette.success.main : theme.palette.divider}`}
                borderRadius={1}
                p={1}
                height="100%"
                overflow="auto"
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() => handleLineClick(idx)}
              >
                <span>{item.prompt}</span>
                <span style={{ backgroundColor: alpha(theme.palette.success.main, 0.5) }}>
                          {item.completion}
                        </span>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Box display="flex" flexDirection="row" p={1}>
        <ButtonGroup>
          <Button
            onClick={handleSelectAll}
            variant="contained"
          >
            Select all
          </Button>
          <Button
            onClick={handleAddToTrainingData}
            variant="contained"
          >
            Add to training data
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}