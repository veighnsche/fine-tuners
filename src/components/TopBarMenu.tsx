import { Divider, Menu, MenuItem, Tooltip } from '@mui/material'

interface TopBarMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const TopBarMenu = ({ anchorEl, open, onClose }: TopBarMenuProps) => {
  const handleNewWindow = () => {
    window.open(window.location.href, '_blank')
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{ '& .MuiPaper-root': { width: 300 } }}
    >
      <MenuItem onClick={handleNewWindow}>New window</MenuItem>
      <Divider />
      <Tooltip title="open .jsonl and .jsonl-edit files" placement="right">
        <MenuItem onClick={onClose}>Open</MenuItem>
      </Tooltip>
      <Tooltip title="for use in this program only" placement="right">
        <MenuItem onClick={onClose}>Save as .jsonl-edit</MenuItem>
      </Tooltip>
      <Tooltip title="for use in OpenAI" placement="right">
        <MenuItem onClick={onClose}>Save as .jsonl</MenuItem>
      </Tooltip>
    </Menu>
  )
}