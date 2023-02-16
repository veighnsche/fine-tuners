import DataObjectIcon from '@mui/icons-material/DataObject'
import { Box, Paper, Theme, Typography } from '@mui/material'

interface HistoryProps {
  width: ReturnType<Theme['spacing']>
  minWidth: ReturnType<Theme['spacing']>
}

export const TrainingData = ({ width, minWidth }: HistoryProps) => {
  return (
    <Paper sx={{
      p: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 1,
      width,
      minWidth,
    }}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
      >
        <DataObjectIcon fontSize="small"/>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          Training Data
        </Typography>
      </Box>
    </Paper>
  )
}