import { Box } from '@mui/material'
import { Model } from "./Model"
import { TrainingFile } from './TrainingFile'

export const TrainSettings = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      px={1}
      p={4}
    >
      <TrainingFile/>
      <Model/>
    </Box>
  )
}