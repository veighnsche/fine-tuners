import { Box, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store'
import type { setModel as setPlaygroundModel } from '../../store/playground.settings.slice'
import type { setModel as setTrainModel } from '../../store/train.settings.slice'


interface ModelProps {
  model: string
  setModel: typeof setTrainModel | typeof setPlaygroundModel
}

export const Model = ({ model, setModel }: ModelProps) => {
  const modelOptions = useAppSelector(state => state.playgroundSettings.modelOptions)
  const fineTunes = useAppSelector(state => state.fineTunes.fineTunes)
  const dispatch = useAppDispatch()

  function makeModelOptions() {
    // from modelOptions and fineTunes, make a list of models
    // that the user can choose from
    const models = new Set<string>()
    modelOptions.forEach((model) => models.add(model))
    fineTunes.forEach((fineTune) => models.add(fineTune.fine_tuned_model))
    return Array.from(models)
  }

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setModel({ model: event.target.value }))
  }

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
        value={model}
        onChange={handleChange}
      >
        {makeModelOptions().map((model) => (
          <MenuItem key={model} value={model}>{model}</MenuItem>
        ))}
      </Select>
    </Box>
  )
}