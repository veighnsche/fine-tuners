import { Box, InputLabel, MenuItem, Select, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { AuthStatus } from '../../auth/auth.model'
import { OpenAiFineTune } from '../../models/openAI/FineTuning'
import { useOpenAI } from '../../hooks/openAI'
import { useAppDispatch, useAppSelector } from '../../store'
import { setModel } from '../../store/train.settings.slice'

export const Model = () => {
  const connected = useAppSelector(state => state.auth.status === AuthStatus.PASSWORD_VERIFIED)
  const currentModel = useAppSelector(state => state.playgroundSettings.model)
  const modelOptions = useAppSelector(state => state.playgroundSettings.modelOptions)
  const dispatch = useAppDispatch()
  const { fetchFineTunesList } = useOpenAI()
  const [fineTunes, setFineTunes] = useState<OpenAiFineTune[]>([])

  useEffect(() => {
    if (connected) {
      fetchFineTunesList()
      .then((models) => {
        setFineTunes(models.data)
      })
    }
  }, [connected])

  function makeModelOptions() {
    // from modelOptions and fineTunes, make a list of models
    // that the user can choose from
    const models = new Set<string>()
    modelOptions.forEach((model) => models.add(model))
    fineTunes.forEach((fineTune) => models.add(fineTune.fine_tuned_model))
    return Array.from(models)
  }

  return (
    <Box>
      <Tooltip
        title="The model determines what kind of words and phrases the AI language model will generate. The standard models are: Davinci, Curie, Babbage, and Ada. Davinci has the most buttons to press and Ada has the fewest. Each button helps the AI language model know what kind of words to use and how to use them."
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
        {makeModelOptions().map((model) => (
          <MenuItem key={model} value={model}>{model}</MenuItem>
        ))}
      </Select>
    </Box>
  )
}