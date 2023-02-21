import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { setDocumentName } from '../store/document.slice'

interface NameDialogProps {
  open: boolean;
  onClose: () => void;
}

export const DialogName = ({ open, onClose }: NameDialogProps) => {
  const dispatch = useAppDispatch()
  const documentName = useAppSelector(state => state.document.name)
  const [name, setName] = useState(documentName)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus()
    }, 100)
  }, [open])

  const handleSubmit = () => {
    dispatch(setDocumentName({ name }))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={ref}
          value={name}
          onChange={e => setName(e.target.value)}
          margin="dense"
          id="name"
          label="Document name"
          fullWidth
          variant="standard"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit()
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  )
}