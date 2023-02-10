import AddIcon from '@mui/icons-material/Add'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import PersonIcon from '@mui/icons-material/Person'
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAuth } from '../../auth'
import { fetchProfiles } from '../../auth/profile.store'
import { AuthStatus, ProfileType } from '../../models/Auth'
import { useAppSelector } from '../../store'
import { Identicon } from '../Identicon'

interface AuthProfilesProps {
  onProfileClick: (profile: ProfileType) => void
  onCreateClick: () => void
}

export const AuthProfiles = ({ onProfileClick, onCreateClick }: AuthProfilesProps) => {
  const currentProfileUuid = useAppSelector(state => state.auth.profile?.uuid)
  const profiles = useLiveQuery(fetchProfiles, [])
  const unverified = useAppSelector(state => state.auth.status === AuthStatus.NO_PASSWORD_VERIFICATION)
  const { testAuth } = useAuth()


  return (
    <>
      <Box width="100%" p={1} display="flex" alignItems="center">
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
        <Box sx={{ flexGrow: 1 }}/>
        {unverified ? (
          <Tooltip title="Test connection">
            <IconButton
              color="inherit"
              size="small"
              sx={{ textTransform: 'none' }}
              onClick={() => testAuth()}
            >
              <LockOpenIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="success.main" sx={{ opacity: 0.5 }}>
            Connected
          </Typography>
        )}
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