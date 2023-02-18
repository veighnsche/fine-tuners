import CloseIcon from '@mui/icons-material/Close'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { Alert, AppBar, Box, Button, IconButton, Slide, Theme, Toolbar, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { AuthMenu } from '../auth/components/AuthMenu'
import { AuthStatusIcon } from '../auth/components/AuthStatusIcon'
import { useAppDispatch, useAppSelector } from '../store'
import { hideNotification, removeNotification } from '../store/notifications.slice'
import { Identicon } from './Identicon'

interface TopBarProps {
  height: ReturnType<Theme['spacing']>;
}

export const TopBar = ({ height }: TopBarProps) => {
  const authMenuAnchor = useRef<HTMLDivElement>(null)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)

  const profile = useAppSelector(state => state.auth.profile)

  const { notifications, shownNotifications } = useAppSelector(state => state.notifications)
  const dispatch = useAppDispatch()

  return (
    <>
      <AppBar position="relative" sx={{ height }}>
        <Box sx={{
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography variant="h6" color="inherit" component="div" lineHeight={height}>
            GPT-3 alignment tool
          </Typography>
        </Box>
        <Toolbar variant="dense" sx={{ display: 'flex', gap: 1, height }}>
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