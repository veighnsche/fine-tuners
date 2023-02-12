import { Box, MenuItem, Select, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setModel } from '../../../store/playground.settings.slice'

export const Model = () => {
  const currentModel = useAppSelector(state => state.playgroundSettings.model)
  const modelOptions = useAppSelector(state => state.playgroundSettings.modelOptions)
  const dispatch = useAppDispatch()

  return (
    <Box>
      <Typography variant="h6" color="inherit" component="div">
        Model
      </Typography>
      <Select
        fullWidth
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