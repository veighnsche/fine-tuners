import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { fetchProfiles } from '../../auth/profile.store'
import { ProfileType } from '../../models/Auth'
import { useAppSelector } from '../../store'
import { Jdenticon } from '../Jdenticon'

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
        <Button
          color="inherit"
          startIcon={<ChevronLeftIcon/>}
          sx={{ textTransform: 'none' }}
          onClick={onCreateClick}
        >
          create new profile
        </Button>
      </Box>
      <List>
        {profiles?.map(profile => (
          <ListItemButton
            key={profile.uuid}
            onClick={() => onProfileClick(profile)}
            selected={profile.uuid === currentProfileUuid}
          >
            <ListItemAvatar>
              <Jdenticon value={profile.name} size={32}/>
            </ListItemAvatar>
            <ListItemText primary={profile.name} secondary={profile.snippet}/>
          </ListItemButton>
        ))}
      </List>
    </>
  )
}