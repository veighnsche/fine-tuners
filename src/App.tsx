import { Grid, Paper } from '@mui/material'
import React from 'react'
import { Lines } from './components/Lines'
import { TopBar } from './components/TopBar'


function App() {
  return (
    <>
      <main>
        <TopBar/>
        <Grid container spacing={1} sx={{ p: 1 }}>
          <Grid item xs={12} sm={6}>
            <Lines/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 1 }}>
              Test
            </Paper>
          </Grid>
        </Grid>
      </main>
    </>
  )
}

export default App
