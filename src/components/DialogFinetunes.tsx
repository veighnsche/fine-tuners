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
import { OpenAiFinetune } from '../models/openAI/FineTuning'
import { useAppDispatch, useAppSelector } from '../store'
import { removeFinetune } from '../store/finetunes.slice'
import { timestampToDateTime } from '../utils/dates'

interface DialogFinetunesProps {
  open: boolean;
  onClose: () => void;
}

export const DialogFinetunes = ({ open, onClose }: DialogFinetunesProps) => {
  const finetunes = useAppSelector((state) => state.finetunes.finetunes)
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedFinetune, setSelectedFinetune] = useState<OpenAiFinetune | null>(null)
  const isOptionsOpen = Boolean(optionsAnchorEl)
  const { deleteFinetune } = useOpenAI()
  const dispatch = useAppDispatch()

  if (finetunes.length === 0) return null

  const handleOptionsClick = (e: MouseEvent<HTMLButtonElement>, finetune: OpenAiFinetune) => {
    e.stopPropagation()
    setOptionsAnchorEl(e.currentTarget)
    setSelectedFinetune(finetune)
  }

  const handleMenuClose = () => {
    setOptionsAnchorEl(null)
  }

  const handleFinetuneDelete = async () => {
    if (selectedFinetune) {
      const { deleted } = await deleteFinetune({
        name: selectedFinetune.fine_tuned_model,
      })
      if (deleted) {
        handleMenuClose()
        dispatch(removeFinetune({ id: selectedFinetune.id }))
      }
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        sx={{ '& .MuiDialog-paper': { width: '80%', height: '80vh' } }}
      >
        <Box display="flex" gap={1} height="100%">
          <Paper sx={{ width: '33%', height: '100%' }} square>
            <List>
              {finetunes.map((finetune, idx) => (
                <Fragment key={finetune.id}>
                  {idx !== 0 && <Divider/>}
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                    }}>
                      <ListItemText
                        primary={finetune.fine_tuned_model}
                        secondary={timestampToDateTime(finetune.created_at)}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={e => handleOptionsClick(e, finetune)}>
                          ⋮
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  </ListItem>
                </Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Dialog>
      {isOptionsOpen ? (
        <Menu
          open
          anchorEl={optionsAnchorEl}
          onClose={handleMenuClose}
          sx={{ '& .MuiMenu-paper': { width: 200 } }}
        >
          <MenuItem onClick={handleFinetuneDelete}>
            Delete
          </MenuItem>
        </Menu>
      ) : null}
    </>
  )
}