import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material'
import { useAppSelector } from '../store'
import { Line } from './Line'

export const Lines = () => {
  const lines = useAppSelector(state => state.lines.lines)

  return (
    <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ flexGrow: 1 }} display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h6" color="inherit" component="div">
          Lines
        </Typography>
        <Box sx={{ flexGrow: 1 }}/>
        <ButtonGroup>
          <Button>Add</Button>
        </ButtonGroup>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        {lines.map((line, idx) => (
          <Paper key={idx} elevation={0} sx={{ p: 1 }} color="primary">
            <Line idx={idx} line={line}/>
          </Paper>
        ))}
      </Box>
    </Paper>
  )
}