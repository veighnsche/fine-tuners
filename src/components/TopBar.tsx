import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { AppBar, Box, Button, IconButton, Paper, Slide, Toolbar, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../store'
import { AuthStatus } from '../store/auth.slice'
import { FileMenu } from './FileMenu'

export function TopBar() {
  const fileMenuAnchor = useRef<HTMLButtonElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const authMenuAnchor = useRef<HTMLButtonElement>(null)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)

  const hasNoProfiles = useAppSelector(state => state.auth.status === AuthStatus.NO_PROFILE_CREATED)
  const [showCreateProfileHint, setShowCreateProfileHint] = useState(hasNoProfiles)

  useEffect(() => {
    setShowCreateProfileHint(hasNoProfiles)
    if (hasNoProfiles) {
      setTimeout(() => {
        setShowCreateProfileHint(false)
      }, 15000)
    }
  }, [hasNoProfiles])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{
            position: 'absolute',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Typography variant="h6" color="inherit" component="div" height="48px">
              Fine Tuners
            </Typography>
          </Toolbar>
          <Toolbar variant="dense" sx={{ display: 'flex', gap: 1 }}>
            <Button
              ref={fileMenuAnchor}
              onClick={() => setFileMenuOpen(true)}
              size="small"
              color="inherit"
              sx={{ textTransform: 'none', display: 'flex', gap: 1 }}
            >
              <FolderOutlinedIcon fontSize="small"/>
              File
            </Button>
            <Box sx={{ flexGrow: 1 }}/>
            <Slide direction="left" in={showCreateProfileHint}>
              <Paper sx={{ p: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Create a profile to connect to OpenAI
                </Typography>
              </Paper>
            </Slide>
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