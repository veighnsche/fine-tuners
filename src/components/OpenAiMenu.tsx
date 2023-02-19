import { Divider, Menu, MenuItem } from '@mui/material'
import { useOpenAI } from '../openAI'
import { useAppDispatch, useAppSelector } from '../store'
import { toggleFilesDialog, toggleNameDialog } from '../store/app.slice'
import { setFiles } from '../store/files.slice'
import { useAddNotification } from '../store/notifications.slice'

interface OpenAiMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}


export const OpenAiMenu = ({ open, anchorEl, onClose }: OpenAiMenuProps) => {
  const { uploadCurrentLines, fetchFiles } = useOpenAI()
  const dispatch = useAppDispatch()
  const addNotification = useAddNotification()
  const documentName = useAppSelector(state => state.document.name)

  const handleUpload = () => {
    onClose()
    if (!documentName) {
      dispatch(toggleNameDialog())
      return
    }
    uploadCurrentLines().then(() => {
      addNotification({ message: 'Uploaded to OpenAI', severity: 'success' })
    })
  }

  const handleTrain = () => {

  }

  const handleTrainUploaded = () => {

  }

  const handleViewFiles = async () => {
    onClose()
    const files = await fetchFiles()
    dispatch(setFiles({ files }))
    dispatch(toggleFilesDialog())
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{ '& .MuiPaper-root': { width: 300 } }}
    >
      <MenuItem onClick={handleUpload}>Upload</MenuItem>
      <MenuItem onClick={handleTrain}>Train</MenuItem>
      <MenuItem onClick={handleTrainUploaded}>Upload & Train</MenuItem>
      <Divider/>
      <MenuItem onClick={handleViewFiles}>View uploaded files</MenuItem>
    </Menu>
  )
}