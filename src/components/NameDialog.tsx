import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch } from '../store'
import { setDocumentName } from '../store/document.slice'

interface NameDialogProps {
  open: boolean;
  onClose: () => void;
}

export const NameDialog = ({ open, onClose }: NameDialogProps) => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Document name"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => {
          dispatch(setDocumentName({ name }))
        }}>
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  )
}