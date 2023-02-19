import {
  alpha,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  useTheme,
} from '@mui/material'
import { Fragment, MouseEvent, useState } from 'react'
import { OpenAiFile } from '../models/openAI/Files'
import { useOpenAI } from '../openAI'
import { useAppDispatch, useAppSelector } from '../store'
import { deleteFileStore, setCurrentLines, unsetCurrentFile } from '../store/files.slice'
import { addLines } from '../store/lines.slice'
import { timestampToDateTime } from '../utils/dates'

interface FilesDialogProps {
  open: boolean;
  onClose: () => void;
}

export const FilesDialog = ({ open, onClose }: FilesDialogProps) => {
  const dispatch = useAppDispatch()
  const files = useAppSelector(state => state.files.files)
  const lines = useAppSelector(state => state.files.currentLines)
  const { fetchFileContent, deleteFile } = useOpenAI()
  const theme = useTheme()
  const [selected, setSelected] = useState<number[]>([])
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<OpenAiFile | null>(null)
  const isOptionsOpen = Boolean(optionsAnchorEl)

  const handleClick = async (id: string) => {
    const content = await fetchFileContent({ id })
    dispatch(setCurrentLines(content))
  }

  const handleClose = () => {
    dispatch(unsetCurrentFile())
    onClose()
  }

  const handleAddToTrainingData = () => {
    if (!lines) return
    const newLines = lines.filter((_, idx) => selected.includes(idx))
    dispatch(addLines({ lines: newLines }))
  }

  const handleSelectAll = () => {
    if (!lines) return
    if (selected.length === lines.length) {
      setSelected([])
    }
    else {
      setSelected(lines.map((_, idx) => idx))
    }
  }

  const handleLineClick = (idx: number) => {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx))
    }
    else {
      setSelected([...selected, idx])
    }
  }

  const handleOptionsClick = (e: MouseEvent<HTMLButtonElement>, file: OpenAiFile) => {
    e.stopPropagation()
    setOptionsAnchorEl(e.currentTarget)
    setSelectedFile(file)
  }

  const handleMenuClose = () => {
    setOptionsAnchorEl(null)
    setSelectedFile(null)
  }

  const handleFileDelete = async () => {
    if (!selectedFile) return
    const id = selectedFile.id
    await deleteFile({ id })
    dispatch(deleteFileStore({ id }))
    handleMenuClose()
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth="xl"
        sx={{ '& .MuiDialog-paper': { width: '80%', height: '80vh' } }}
        onClose={handleClose}
      >
        <Box display="flex" gap={1} height="100%">
          <Paper sx={{ width: '30%', height: '100%' }} square>
            <List>
              {files.map((file, idx) => (
                <Fragment key={file.id}>
                  {idx !== 0 && <Divider/>}
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleClick(file.id)}>
                      <ListItemText
                        primary={file.filename}
                        secondary={timestampToDateTime(file.created_at)}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={e => handleOptionsClick(e, file)}>
                          ⋮
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  </ListItem>
                </Fragment>
              ))}
            </List>
          </Paper>
          {lines ? (
            <Box display="flex" flexDirection="column" width="66%" height="100%">
              <Box width="100%" height="100%" overflow="auto">
                <ImageList variant="masonry" cols={2} gap={8}>
                  {lines.map((item, idx) => (
                    <ImageListItem key={idx}>
                      <Box
                        border={`1px solid ${selected.includes(idx) ? theme.palette.success.main : theme.palette.divider}`}
                        borderRadius={1}
                        p={1}
                        height="100%"
                        overflow="auto"
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => handleLineClick(idx)}
                      >
                        <span>{item.prompt}</span>
                        <span style={{ backgroundColor: alpha(theme.palette.success.main, 0.5) }}>
                          {item.completion}
                        </span>
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
              <Box display="flex" flexDirection="row" p={1}>
                <ButtonGroup>
                  <Button
                    onClick={handleSelectAll}
                    variant="contained"
                  >
                    Select all
                  </Button>
                  <Button
                    onClick={handleAddToTrainingData}
                    variant="contained"
                  >
                    Add to training data
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Dialog>
      {isOptionsOpen ? (
        <Menu
          open
          anchorEl={optionsAnchorEl}
          onClose={handleMenuClose}
          sx={{ '& .MuiMenu-paper': { width: 200 } }}
        >
          <MenuItem onClick={handleFileDelete}>
            Delete
          </MenuItem>
        </Menu>
      ) : null}
    </>
  )
}