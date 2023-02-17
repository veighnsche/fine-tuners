import { Box, Button, InputLabel, TextField, Tooltip } from '@mui/material'
import { ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { setStopSequences } from '../../store/playground.settings.slice'

export const StopSequences = () => {
  const stopSequences = useAppSelector(state => state.playgroundSettings.stopSequences)
  const dispatch = useAppDispatch()

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setStopSequences({ stopSequences: stopSequences.map((stopSequence, i) => (i === idx ? e.target.value : stopSequence)) }))
  }

  const handleAdd = () => {
    // max: 4 stop sequences
    if (stopSequences.length < 4) {
      dispatch(setStopSequences({ stopSequences: [...stopSequences, ''] }))
    }
  }

  const handleBlur = () => {
    // remove empty stop sequences
    const newStopSequences = stopSequences.filter((stopSequence) => stopSequence !== '')
    dispatch(setStopSequences({ stopSequences: newStopSequences }))
  }

  return (
    <Box>
      <Tooltip
        title="Stop sequence is like a finish line for the AI language model. When it reaches the stop sequence in its answer, it knows to stop making up words and phrases. The stop sequence is not included in the final answer, so you won't see it in the text the AI language model generates. You can set up to four stop sequences if you want the AI language model to stop at different places in its answer."
        placement="left"
      >
        <InputLabel>
          Stop Sequences
        </InputLabel>
      </Tooltip>
      {stopSequences.map((stopSequence, idx) => (
        <TextField
          key={idx}
          fullWidth
          size="small"
          value={stopSequence}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(idx, e)}
          onBlur={handleBlur}
        />
      ))}
      <Button
        size="small"
        variant="outlined"
        onClick={handleAdd}
        fullWidth
        disabled={stopSequences.length >= 4}
      >Add</Button>
    </Box>
  )
}