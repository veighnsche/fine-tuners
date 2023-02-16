import HistoryIcon from '@mui/icons-material/History'
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Theme, Typography } from '@mui/material'
import { Fragment } from 'react'
import { useAppSelector } from '../store'
import { HistoryItem } from '../store/document.slice'

interface HistoryProps {
  width: ReturnType<Theme['spacing']>
  minWidth: ReturnType<Theme['spacing']>
  onHistoryItemClick: (item: HistoryItem) => void
}

export const History = ({ width, minWidth, onHistoryItemClick }: HistoryProps) => {
  const historyItems = useAppSelector(state => state.document.history)
  return (
    <Paper sx={{
      p: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 1,
      width,
      minWidth,
    }}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
      >
        <HistoryIcon fontSize="small"/>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          History
        </Typography>
      </Box>
      {historyItems.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            flexGrow: 1,
            opacity: 0.5,
          }}
        >
          <Typography
            variant="body2"
            component="div"
          >
            No history items
          </Typography>
        </Box>
      ) : (
        <List>
          {historyItems.map((item, index) => (
            <Fragment key={index}>
              {index !== 0 ? <Divider/> : null}
              <ListItem disablePadding>
                <ListItemButton onClick={() => onHistoryItemClick(item)}>
                  <ListItemText
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      '& .MuiListItemText-primary': {
                        textOverflow: 'ellipsis',
                      },
                      '& .MuiListItemText-secondary': {
                        textOverflow: 'ellipsis',
                      },
                    }}
                    primary={item.params.prompt}
                    secondary={item.completion}
                  />
                </ListItemButton>
              </ListItem>
            </Fragment>
          ))}
        </List>
      )}

    </Paper>
  )
}