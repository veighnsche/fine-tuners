import { Divider, Menu, MenuItem, Tooltip } from '@mui/material'
import { useAppSelector } from '../store'
import { createJsonlEditFile, createJsonlFile, selectFile } from '../utils/files'

interface TopBarMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const FileMenu = ({ anchorEl, open, onClose }: TopBarMenuProps) => {
  const getLines = useAppSelector(state => () => state.lines.lines)
  const getDocState = useAppSelector(state => () => state.document)

  const handleNewWindow = () => {
    window.open(window.location.href, '_blank')
    onClose()
  }

  const handleOpenFileClick = async () => {
    onClose()
    const file = await selectFile()
    console.log(file)
  }

  const handleEditSaveClick = () => {
    onClose()
    createJsonlEditFile({ docState: getDocState(), lines: getLines(), name: 'test' })
  }

  const handleSaveClick = () => {
    onClose()
    createJsonlFile({ lines: getLines(), name: 'test' })
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{ '& .MuiPaper-root': { width: 300 } }}
    >
      <MenuItem onClick={handleNewWindow}>New window</MenuItem>
      <Divider/>
      <Tooltip title="open .jsonl and .jsonl-edit files" placement="right">
        <MenuItem onClick={handleOpenFileClick}>Open</MenuItem>
      </Tooltip>
      <Tooltip title="for use in this program only" placement="right">
        <MenuItem onClick={handleEditSaveClick}>Save as .jsonl-edit</MenuItem>
      </Tooltip>
      <Tooltip title="for use in OpenAI" placement="right">
        <MenuItem onClick={handleSaveClick}>Save as .jsonl</MenuItem>
      </Tooltip>
    </Menu>
  )
}