import CloseIcon from '@mui/icons-material/Close'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { useAppSelector } from '../store'
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

  // todo: turn this into notifications component
  // const hasNoProfiles = useAppSelector(state => state.auth.status === AuthStatus.NO_PROFILE_CREATED)
  // const [showCreateProfileHint, setShowCreateProfileHint] = useState(hasNoProfiles)
  //
  // useEffect(() => {
  //   setShowCreateProfileHint(hasNoProfiles)
  //   if (hasNoProfiles) {
  //     setTimeout(() => {
  //       setShowCreateProfileHint(false)
  //     }, 15000)
  //   }
  // }, [hasNoProfiles])
  // todo: turn this into notifications component

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
              sx={{ textTransform: 'none' }}
              startIcon={<FolderOutlinedIcon fontSize="small"/>}
            >
              File
            </Button>
            <Box sx={{ flexGrow: 1 }}/>

            {/* todo: turn this into notifications component */}
            {/*<Slide direction="left" in={showCreateProfileHint}>*/}
            {/*  <Paper sx={{ p: 1 }}>*/}
            {/*    <Typography variant="body2" color="text.secondary">*/}
            {/*      Create a profile to connect to OpenAI*/}
            {/*    </Typography>*/}
            {/*  </Paper>*/}
            {/*</Slide>*/}
            {/* todo: turn this into notifications component */}

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