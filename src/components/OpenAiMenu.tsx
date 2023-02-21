import { Divider, Menu, MenuItem } from '@mui/material'
import { useOpenAI } from '../hooks/openAI'
import { useAppDispatch, useAppSelector } from '../store'
import { openDialog } from '../store/app.slice'
import { setFiles } from '../store/files.slice'
import { useAddNotification } from '../store/notifications.slice'

interface OpenAiMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}


export const OpenAiMenu = ({ open, anchorEl, onClose }: OpenAiMenuProps) => {
  const { uploadFile, fetchFileList } = useOpenAI()
  const dispatch = useAppDispatch()
  const addNotification = useAddNotification()
  const documentName = useAppSelector(state => state.document.name)

  const handleUpload = () => {
    onClose()
    if (!documentName) {
      dispatch(openDialog({ dialog: 'name' }))
      return
    }
    uploadFile().then(() => {
      addNotification({ message: 'Uploaded to OpenAI', severity: 'success' })
    })
  }

  const handleTrain = () => {
    // todo: unimplemented
  }

  const handleTrainUploaded = () => {
    // todo: unimplemented
  }

  const handleViewFiles = async () => {
    onClose()
    const files = await fetchFileList()
    dispatch(setFiles({ files }))
    dispatch(openDialog({ dialog: 'files' }))
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