import { Box, Button, ButtonGroup, Paper, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { useOpenAI } from '../../openAI'
import { useAppDispatch, useAppSelector } from '../../store'
import { selectPlaygroundSettings, setPlaygroundSettingsOpen } from '../../store/playground.settings.slice'
import { CompletePrompt } from './CompletePrompt'

export const Playground = () => {
  const isPlaygroundSettingsOpen = useAppSelector(state => state.playgroundSettings.isOpen)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { createCompletionStream } = useOpenAI()
  const settings = useAppSelector(selectPlaygroundSettings)
  const [stream, setStream] = useState<ReadableStream>()

  const handleGenerate = async () => {
    const stream: ReadableStream = await createCompletionStream(settings)
    setStream(stream)
  }

  const clearStream = () => {
    setStream(undefined)
  }

  return (
    <Paper sx={{
      p: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      height: `calc(100vh - ${theme.spacing(10)})`,
    }}>
      <Box display="flex">
        <Typography variant="h6" color="inherit" component="div">
          Playground
        </Typography>
        <Box sx={{ flexGrow: 1 }}/>
        <ButtonGroup>
          <Button onClick={() => {
            dispatch(setPlaygroundSettingsOpen({ isOpen: !isPlaygroundSettingsOpen }))
          }}>
            Settings
          </Button>
        </ButtonGroup>
      </Box>
      <CompletePrompt stream={stream} clearStream={clearStream}/>
      <Box display="flex" flexDirection="row">
        <ButtonGroup>
          <Button
            onClick={handleGenerate}
            variant="contained"
          >
            Generate
          </Button>
        </ButtonGroup>
      </Box>

    </Paper>
  )
}