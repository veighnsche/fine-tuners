import { Box } from '@mui/material'
import { useAppSelector } from '../../store'
import { setModel } from '../../store/train.settings.slice'
import { Model } from '../shared.settings/Model'

import { TrainingFile } from './TrainingFile'

export const TrainSettings = () => {
  const model = useAppSelector(state => state.trainSettings.model!)
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      px={1}
      p={4}
    >
      <TrainingFile/>
      <Model model={model} setModel={setModel}/>
    </Box>
  )
}