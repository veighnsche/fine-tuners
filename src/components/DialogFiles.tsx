import {
  Box,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material'
import { Fragment, MouseEvent, useState } from 'react'
import { useOpenAI } from '../hooks/openAI'
import { OpenAiFile } from '../models/openAI/Files'
import { useAppDispatch, useAppSelector } from '../store'
import { deleteFileStore, selectFinetuneFiles, setCurrentLines, unsetCurrentFile } from '../store/files.slice'
import { setTrainingFile } from '../store/train.settings.slice'
import { timestampToDateTime } from '../utils/dates'
import { FileContents } from './FileContents'
import { FileTrain } from './FileTrain'

interface FilesDialogProps {
  open: boolean;
  onClose: () => void;
}

export const DialogFiles = ({ open, onClose }: FilesDialogProps) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<OpenAiFile | null>(null)
  const [showing, setShowing] = useState<'contents' | 'train'>('contents')

  const dispatch = useAppDispatch()
  const files = useAppSelector(selectFinetuneFiles)
  const { fetchFile, deleteFile } = useOpenAI()
  const isOptionsOpen = Boolean(optionsAnchorEl)

  const handleFileClick = async (id: string) => {
    const content = await fetchFile({ id })
    dispatch(setCurrentLines(content))
  }

  const handleClose = () => {
    dispatch(unsetCurrentFile())
    onClose()
  }

  const handleOptionsClick = (e: MouseEvent<HTMLButtonElement>, file: OpenAiFile) => {
    e.stopPropagation()
    setOptionsAnchorEl(e.currentTarget)
    setSelectedFile(file)
  }

  const handleMenuClose = () => {
    setOptionsAnchorEl(null)
  }

  const handleFileDelete = async () => {
    if (!selectedFile) return
    const id = selectedFile.id
    await deleteFile({ id })
    dispatch(deleteFileStore({ id }))
    setSelectedFile(null)
    handleMenuClose()
  }

  const handleViewContents = async () => {
    await handleFileClick(selectedFile!.id)
    setShowing('contents')
    handleMenuClose()
  }

  const handleTrain = async () => {
    dispatch(setTrainingFile({ trainingFile: selectedFile! }))
    setShowing('train')
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
          <Paper sx={{ width: '33%', height: '100%' }} square>
            <List>
              {files.map((file, idx) => (
                <Fragment key={file.id}>
                  {idx !== 0 && <Divider/>}
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleFileClick(file.id)}>
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
          {showing === 'contents' ? <FileContents/> : null}
          {showing === 'train' ? <FileTrain/> : null}
        </Box>
      </Dialog>
      {isOptionsOpen ? (
        <Menu
          open
          anchorEl={optionsAnchorEl}
          onClose={handleMenuClose}
          sx={{ '& .MuiMenu-paper': { width: 200 } }}
        >
          <MenuItem onClick={handleTrain}>
            Train
          </MenuItem>
          <Divider/>
          <MenuItem onClick={handleViewContents}>
            View contents
          </MenuItem>
          <MenuItem onClick={handleFileDelete}>
            Delete
          </MenuItem>
        </Menu>
      ) : null}
    </>
  )
}