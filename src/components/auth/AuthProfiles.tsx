import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import { Box, Button, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Tooltip } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { fetchProfiles } from '../../auth/profile.store'
import { ProfileType } from '../../models/Auth'
import { useAppSelector } from '../../store'
import { Identicon } from '../Identicon'

interface AuthProfilesProps {
  onProfileClick: (profile: ProfileType) => void
  onCreateClick: () => void
}

export const AuthProfiles = ({ onProfileClick, onCreateClick }: AuthProfilesProps) => {
  const currentProfileUuid = useAppSelector(state => state.auth.profile?.uuid)
  const profiles = useLiveQuery(fetchProfiles, [])
  return (
    <>
      <Box width="100%" p={1}>
        <Tooltip title="Create new profile">
          <Button
            color="inherit"
            sx={{ textTransform: 'none' }}
            onClick={onCreateClick}
          >
            <AddIcon fontSize="small"/>
            <PersonIcon/>
          </Button>
        </Tooltip>
      </Box>
      <Divider sx={{ width: '100%' }}/>
      <List sx={{ width: '100%', overflow: 'auto' }}>
        {profiles?.map(profile => (
          <ListItemButton
            key={profile.uuid}
            onClick={() => onProfileClick(profile)}
            selected={profile.uuid === currentProfileUuid}
          >
            <ListItemAvatar>
              <Identicon value={profile.name} size={32}/>
            </ListItemAvatar>
            <ListItemText primary={profile.name} secondary={profile.snippet}/>
          </ListItemButton>
        ))}
      </List>
    </>
  )
}