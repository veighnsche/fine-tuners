import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { TopBarMenu } from './TopBarMenu'

export function TopBar() {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              ref={menuButtonRef}
              onClick={() => setMenuOpen(true)}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Fine Tuners
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {menuOpen ? (
        <TopBarMenu
          open
          anchorEl={menuButtonRef.current}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </>
  )
}