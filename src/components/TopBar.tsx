import CloseIcon from '@mui/icons-material/Close'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { Alert, AppBar, Box, Button, IconButton, Slide, Toolbar, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { hideNotification, removeNotification } from '../store/notifications.slice'
import { AuthMenu } from './auth/AuthMenu'
import { AuthStatusIcon } from './auth/AuthStatusIcon'
import { FileMenu } from './FileMenu'
import { Identicon } from './Identicon'

export function TopBar() {
  const fileMenuAnchor = useRef<HTMLButtonElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const authMenuAnchor = useRef<HTMLDivElement>(null)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)

  const profile = useAppSelector(state => state.auth.profile)

  const { notifications, shownNotifications } = useAppSelector(state => state.notifications)
  const dispatch = useAppDispatch()

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
            <Typography variant="h6" color="inherit" component="div" lineHeight="60px">
              Fine Tuners
            </Typography>
          </Toolbar>
          <Toolbar variant="dense" sx={{ display: 'flex', gap: 1, height: '60px' }}>
            <Button
              ref={fileMenuAnchor}
              onClick={() => setFileMenuOpen(true)}
              size="small"
              color="inherit"
              sx={{ textTransform: 'none' }}
              startIcon={<FolderOutlinedIcon fontSize="small"/>}
            >
              <Typography variant="body2" color="inherit" component="div">
                File
              </Typography>
            </Button>
            <Box sx={{ flexGrow: 1 }}/>

            <Box display="flex" sx={{ gap: 1 }} p={0.5}>
              {notifications.map(notification => {
                return (
                  <Slide
                    key={notification.id}
                    direction="left"
                    in={shownNotifications.includes(notification.id)}
                    onExited={() => dispatch(removeNotification(notification))}
                  >
                    <Alert
                      severity={notification.severity}
                      onClose={() => dispatch(hideNotification(notification))}
                      variant="outlined"
                    >
                      {notification.message}
                    </Alert>
                  </Slide>
                )
              })}
            </Box>

            <div ref={authMenuAnchor}>
              {profile ? (
                <Button
                  onClick={() => setAuthMenuOpen(!authMenuOpen)}
                  size="small"
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                  endIcon={(
                    <>
                      <AuthStatusIcon/>
                      {authMenuOpen
                        ? <CloseIcon sx={{ width: 30, height: 30 }}/>
                        : <Identicon value={profile.name} size={30}/>}
                    </>
                  )}
                >
                  <Typography variant="body2" color="inherit" component="div">
                    {profile.name}
                  </Typography>
                </Button>
              ) : (
                <IconButton
                  onClick={() => setAuthMenuOpen(!authMenuOpen)}
                  edge="end"
                  color="inherit"
                  aria-label="authentication menu"
                >
                  {authMenuOpen ? <CloseIcon/> : <PersonOffIcon/>}
                </IconButton>
              )}
            </div>
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
      {authMenuAnchor.current ? (
        <AuthMenu
          open={authMenuOpen}
          setOpen={setAuthMenuOpen}
          anchorEl={authMenuAnchor.current}
          onClose={() => setAuthMenuOpen(false)}
        />
      ) : null}
    </>
  )
}