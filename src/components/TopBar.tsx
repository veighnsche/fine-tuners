import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { FileMenu } from './FileMenu'

export function TopBar() {
  const fileMenuAnchor = useRef<HTMLButtonElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const authMenuAnchor = useRef<HTMLButtonElement>(null)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              ref={fileMenuAnchor}
              onClick={() => setFileMenuOpen(true)}
              edge="start"
              color="inherit"
              aria-label="file menu"
              sx={{ mr: 2 }}
            >
              <FolderOutlinedIcon/>
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Fine Tuners
            </Typography>
            <Box sx={{ flexGrow: 1 }}/>
            <IconButton
              ref={authMenuAnchor}
              onClick={() => setAuthMenuOpen(true)}
              edge="end"
              color="inherit"
              aria-label="authentication menu"
            >
              <LockOutlinedIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      {fileMenuOpen ? (
        <FileMenu
          open
          anchorEl={fileMenuAnchor.current}
          onClose={() => setFileMenuOpen(false)}
        />
      ) : null}
      {authMenuOpen ? (
        <FileMenu
          open
          anchorEl={authMenuAnchor.current}
          onClose={() => setAuthMenuOpen(false)}
        />
      ) : null}
    </>
  )
}