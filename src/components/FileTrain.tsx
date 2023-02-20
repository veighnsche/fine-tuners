import { Box, Button, ButtonGroup, Paper } from '@mui/material'
import { useRef } from 'react'
import { OpenAiFineTuningEvent } from '../models/openAI/FineTuning'
import { useOpenAI } from '../openAI'
import { useAppSelector } from '../store'
import { selectTrainSettings } from '../store/train.settings.slice'
import { TrainSettings } from './train.settings'

export const FileTrain = () => {
  const settings = useAppSelector(selectTrainSettings)
  const { trainFile } = useOpenAI()
  const paperRef = useRef<HTMLDivElement>(null)

  const handleTrain = async () => {
    // trainFile({ params: settings })
    const trainingEvents = await trainFile({ params: settings })

    for await (const event of trainingEvents) {
      console.log(event)
      const p = document.createElement('p')
      p.innerText = (event.chunk as OpenAiFineTuningEvent).message
      paperRef.current!.appendChild(p)
    }
  }

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1} width="33%" minWidth="33%" p={1}>
        <TrainSettings />
        <Box sx={{ flexGrow: 1 }} />
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTrain}
          >
            Train
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        width="34%"
        minWidth="34%"
        p={1}
      >
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 1,
          }}
          ref={paperRef}
        >
          Training Progress
        </Paper>
      </Box>
    </>
  )
}