import { Box, Theme } from '@mui/material'
import { Model } from '../playground.settings/Model'
import { TrainingFile } from './TrainingFile'

interface TrainSettingsProps {
  width: ReturnType<Theme['spacing']>
  minWidth: ReturnType<Theme['spacing']>
}

export const TrainSettings = ({ width, minWidth }: TrainSettingsProps) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={4}
    px={1}
    width={width}
    minWidth={minWidth}
    p={4}
  >
    <TrainingFile/>
    <Model/>
  </Box>
)