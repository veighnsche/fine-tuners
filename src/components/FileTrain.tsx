import { Box, Paper } from '@mui/material'
import { TrainSettings } from './train.settings'

export const FileTrain = () => {
  return (
    <>
      <TrainSettings width="33%" minWidth="33%" />
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
        >
          Training Progress
        </Paper>
      </Box>
    </>
  )
}