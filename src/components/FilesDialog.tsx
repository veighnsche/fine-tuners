import {
  alpha,
  Box,
  Dialog,
  Divider,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  useTheme,
} from '@mui/material'
import { Fragment } from 'react'
import { useOpenAI } from '../openAI'
import { useAppDispatch, useAppSelector } from '../store'
import { setCurrentLines } from '../store/files.slice'
import { timestampToDateTime } from '../utils/dates'

interface FilesDialogProps {
  open: boolean;
  onClose: () => void;
}

export const FilesDialog = ({ open, onClose }: FilesDialogProps) => {
  const dispatch = useAppDispatch()
  const files = useAppSelector(state => state.files.files)
  const lines = useAppSelector(state => state.files.currentLines)
  const { fetchFileContent } = useOpenAI()
  const theme = useTheme()

  const handleClick = async (id: string) => {
    const content = await fetchFileContent({ id })
    dispatch(setCurrentLines(content))
  }

  return (
    <Dialog
      open={open}
      maxWidth="xl"
      sx={{ '& .MuiDialog-paper': { width: '80%', height: '80vh' } }}
      onClose={onClose}
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
                  </ListItemButton>
                </ListItem>
              </Fragment>
            ))}
          </List>
        </Paper>
        {lines ? (
          <Box width="66%" height="100%" overflow="auto">
            <ImageList variant="masonry" cols={2} gap={8}>
              {lines.map((item, idx) => (
                <ImageListItem key={idx}>
                  <Box
                    border={`1px solid ${theme.palette.divider}`}
                    borderRadius={1}
                    p={1}
                    height="100%"
                    overflow="auto"
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
        ) : null}
      </Box>
    </Dialog>
  )
}