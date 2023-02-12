import { Box, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setModel } from '../../../store/playground.settings.slice'

export const Model = () => {
  const currentModel = useAppSelector(state => state.playgroundSettings.model)
  const modelOptions = useAppSelector(state => state.playgroundSettings.modelOptions)
  const dispatch = useAppDispatch()

  return (
    <Box>
      <Tooltip
        title="The model determines what kind of words and phrases the AI language model will generate. We have four models to choose from: Davinci, Curie, Babbage, and Ada. Davinci has the most buttons to press and Ada has the fewest. Each button helps the AI language model know what kind of words to use and how to use them."
        placement="left"
      >
        <InputLabel>
          Model
        </InputLabel>
      </Tooltip>
      <Select
        fullWidth
        size="small"
        value={currentModel}
        onChange={(event) => {
          dispatch(setModel({ model: event.target.value }))
        }}
      >
        {modelOptions.map((model) => (
          <MenuItem key={model} value={model}>{model}</MenuItem>
        ))}
      </Select>
    </Box>
  )
}