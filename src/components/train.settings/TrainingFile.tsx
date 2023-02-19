import { TextField } from '@mui/material'
import { useAppSelector } from '../../store'

export const TrainingFile = () => {
  const trainingFile = useAppSelector(state => state.trainSettings.trainingFile)

  if (!trainingFile) return null

  return (
    <TextField
      label="Training File"
      value={trainingFile.filename}
      fullWidth
      disabled
    />
  )
}