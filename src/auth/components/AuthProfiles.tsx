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
import { Identicon } from '../../components/Identicon'
import { useOpenAI } from '../../openAI'
import { useAppSelector } from '../../store'
import { AuthStatus, ProfileType } from '../auth.model'
import { fetchProfiles } from '../profile.store'

interface AuthProfilesProps {
  onProfileClick: (profile: ProfileType) => void
  onCreateClick: () => void
}

export const AuthProfiles = ({ onProfileClick, onCreateClick }: AuthProfilesProps) => {
  const currentProfileUuid = useAppSelector(state => state.auth.profile?.uuid)
  const profiles = useLiveQuery(fetchProfiles, [])
  const verified = useAppSelector(state => state.auth.status === AuthStatus.PASSWORD_VERIFIED)
  const { testAuth } = useOpenAI()


  return (
    <>
      <Box width="100%" p={1} display="flex" alignItems="center">
        <Tooltip title="Create new profile">
          <Button
            color="inherit"
            onClick={onCreateClick}
          >
            <AddIcon fontSize="small"/>
            <PersonIcon/>
          </Button>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }}/>
        {verified ? (
          <Typography variant="body2" color="success.main" sx={{ opacity: 0.5 }}>
            Connected
          </Typography>
        ) : (
          <Tooltip title="Test connection">
            <IconButton
              color="inherit"
              size="small"
              onClick={() => testAuth()}
            >
              <LockOpenIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
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