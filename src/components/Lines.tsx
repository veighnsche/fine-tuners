import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store'
import { newLine } from '../store/lines.slice'
import { Line } from './Line'

export const Lines = () => {
  const dispatch = useAppDispatch()
  const lines = useAppSelector(state => state.lines.lines)

  const handleAdd = () => {
    dispatch(newLine())
  }

  return (
    <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ flexGrow: 1 }} display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h6" color="inherit" component="div">
          Lines
        </Typography>
        <Box sx={{ flexGrow: 1 }}/>
        <ButtonGroup>
          <Button onClick={handleAdd}>
            Add
          </Button>
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