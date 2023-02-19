import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { Box, Button, Theme, Typography, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { OpenAiIcon } from '../icons/openAiIcon'
import { useAppSelector } from '../store'
import { FileMenu } from './FileMenu'
import { OpenAiMenu } from './OpenAiMenu'

interface MidBarProps {
  height: ReturnType<Theme['spacing']>;
}

export const MidBar = ({ height }: MidBarProps) => {
  const theme = useTheme()

  const fileMenuAnchor = useRef<HTMLButtonElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)

  const openAiAnchor = useRef<HTMLButtonElement>(null)
  const [openAiMenuOpen, setOpenAiMenuOpen] = useState(false)

  const documentName = useAppSelector(state => state.document.name)

  return (
    <>
      <Box
        height={height}
        p={1}
        pb={0}
        width="100%"
      >
        <Box sx={{
          position: 'absolute',
          // todo: tech debt: this is a hack to make the box take up the full height
          width: '99%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {documentName ? (
            <Typography color="inherit" component="div" lineHeight="40px">
              {documentName}
            </Typography>
          ) : (
            <Typography color={theme.palette.text.disabled} component="div" lineHeight="40px" fontStyle="italic">
              Untitled
            </Typography>
          )}
        </Box>
        <Box
          display="flex"
          borderRadius={`${theme.shape.borderRadius}px`}
          height="100%"
          sx={{
            backgroundColor: theme.palette.divider,
          }}
          gap={1}
        >
          <Button
            ref={fileMenuAnchor}
            onClick={() => setFileMenuOpen(true)}
            size="small"
            color="inherit"
            startIcon={<FolderOutlinedIcon fontSize="small"/>}
          >
            <Typography variant="body2" color="inherit" component="div">
              File
            </Typography>
          </Button>
          <Button
            ref={openAiAnchor}
            onClick={() => setOpenAiMenuOpen(true)}
            size="small"
            color="inherit"
            startIcon={<OpenAiIcon fontSize="small"/>}
          >
            <Typography variant="body2" color="inherit" component="div">
              Open AI
            </Typography>
          </Button>
        </Box>
      </Box>
      {fileMenuOpen ? (
        <FileMenu
          open
          anchorEl={fileMenuAnchor.current}
          onClose={() => setFileMenuOpen(false)}
        />
      ) : null}
      {openAiMenuOpen ? (
        <OpenAiMenu
          open
          anchorEl={openAiAnchor.current}
          onClose={() => setOpenAiMenuOpen(false)}
        />
      ) : null}
    </>
  )
}