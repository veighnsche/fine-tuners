import { Box, Button, ButtonGroup, Paper, Theme, Typography } from '@mui/material'
import { useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { OpenAiCreateCompletionParameters } from '../models/openAI/CreateCompletion'
import { useOpenAI } from '../openAI'
import { useAppDispatch, useAppSelector } from '../store'
import { addHistoryItem } from '../store/document.slice'
import { selectPlaygroundSettings } from '../store/playground.settings.slice'
import { TextEditorRefHandler, TextEditor } from "./TextEditor";

interface PlaygroundProps {
  width: ReturnType<Theme['spacing']>
}

export const Playground = ({ width }: PlaygroundProps) => {
  const { createCompletion } = useOpenAI()
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectPlaygroundSettings)
  const completePromptRef = useRef<TextEditorRefHandler>(null)

  const makeHistoryItem = (params: OpenAiCreateCompletionParameters) => ({
    id: uuid(),
    createdAt: new Date().toISOString(),
    completion: completePromptRef.current?.completionText || '',
    params,
  })

  const handleGenerate = async () => {
    if (completePromptRef.current) {
      const params = {
        ...settings,
        prompt: completePromptRef.current.promptText,
      }

      for await (const { done, chunk } of createCompletion({ params })) {
        if (done) {
          dispatch(addHistoryItem({ historyItem: makeHistoryItem(params) }))
          break
        }
        completePromptRef.current?.chunk(chunk)
      }
    }
  }

  const handleRedo = () => {
    if (completePromptRef.current) {
      completePromptRef.current?.redoCompletion()
      handleGenerate()
    }
  }

  return (
    <Box
      p={1}
      width={width}
      height="100%"
    >
      <Paper sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 1,
      }}>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          Playground
        </Typography>
        <TextEditor ref={completePromptRef}/>
        <Box display="flex" flexDirection="row">
          <ButtonGroup>
            <Button
              onClick={handleGenerate}
              variant="contained"
            >
              Generate
            </Button>
            <Button
              onClick={handleRedo}
              variant="contained"
            >
              Redo
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>
    </Box>
  )
}

