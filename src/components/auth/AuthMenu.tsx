import styled from '@emotion/styled'
import { Box, Grow, Paper, Popper } from '@mui/material'
import { styled as muiStyled } from '@mui/material/styles'
import { ReactNode, useEffect, useState } from 'react'
import { AuthStatus, ProfileType } from '../../models/Auth'
import { useAppSelector } from '../../store'
import { AuthCreatePassword } from './AuthCreatePassword'
import { AuthCreateProfile } from './AuthCreateProfile'
import { AuthEditPassword } from './AuthEditPassword'
import { AuthEditProfile } from './AuthEditProfile'
import { AuthProfile } from './AuthProfile'
import { AuthProfiles } from './AuthProfiles'

interface TopBarMenuProps {
  anchorEl: HTMLElement
  open: boolean
  onClose: () => void
}

enum AuthTabs {
  CREATE_PROFILE,
  CREATE_PASSWORD,
  PROFILES,
  PROFILE,
  ENTER_PASSWORD,
  EDIT_PROFILE,
  EDIT_PASSWORD,
}

export const AuthMenu = ({ anchorEl, open, onClose }: TopBarMenuProps) => {

  const status = useAppSelector(state => state.auth.status)
  const [tab, setTab] = useState(AuthTabs.PROFILES)
  const [profile, setProfile] = useState<ProfileType | undefined>()

  useEffect(() => {
    if (status === AuthStatus.NO_PROFILE_CREATED) {
      setTab(AuthTabs.CREATE_PROFILE)
    }
  }, [status])

  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
    >
      <Grow in={open}>
        <StyledTabPaper elevation={6}>
          <TabPanel value={tab} index={AuthTabs.CREATE_PROFILE}>
            <AuthCreateProfile
              canGoBack={status !== AuthStatus.NO_PROFILE_CREATED}
              onBackClick={() => setTab(AuthTabs.PROFILES)}
              onPasswordClick={() => setTab(AuthTabs.CREATE_PASSWORD)}
            />
          </TabPanel>
          <TabPanel value={tab} index={AuthTabs.CREATE_PASSWORD}>
            <AuthCreatePassword
              onBackClick={() => setTab(AuthTabs.CREATE_PROFILE)}
              onSubmitClick={() => setTab(AuthTabs.PROFILES)}
            />
          </TabPanel>
          <TabPanel value={tab} index={AuthTabs.PROFILES}>
            <AuthProfiles
              onCreateClick={() => setTab(AuthTabs.CREATE_PROFILE)}
              onProfileClick={profile => {
                setProfile(profile)
                setTab(AuthTabs.PROFILE)
              }}
            />
          </TabPanel>
          <TabPanel value={tab} index={AuthTabs.PROFILE}>
            <AuthProfile
              profile={profile}
              onBackClick={() => setTab(AuthTabs.PROFILES)}
              onEditClick={() => setTab(AuthTabs.EDIT_PROFILE)}
            />
          </TabPanel>
          <TabPanel value={tab} index={AuthTabs.ENTER_PASSWORD}>
            <AuthEditPassword
              profile={profile}
              onBackClick={() => setTab(AuthTabs.PROFILE)}
              onSubmitClick={() => {
                setTab(AuthTabs.PROFILES)
                onClose()
              }}
            />
          </TabPanel>
          <TabPanel value={tab} index={AuthTabs.EDIT_PROFILE}>
            <AuthEditProfile
              profile={profile}
              onBackClick={() => setTab(AuthTabs.PROFILE)}
              onUseClick={() => setTab(AuthTabs.ENTER_PASSWORD)}
              onSubmitClick={() => setTab(AuthTabs.PROFILE)}
              onPasswordClick={() => setTab(AuthTabs.EDIT_PASSWORD)}
            />
          </TabPanel>
          <TabPanel value={tab} index={AuthTabs.EDIT_PASSWORD}>
            <AuthEditPassword
              profile={profile}
              onBackClick={() => setTab(AuthTabs.PROFILE)}
              onSubmitClick={() => setTab(AuthTabs.PROFILE)}
            />
          </TabPanel>
        </StyledTabPaper>
      </Grow>
    </Popper>
  )
}

const StyledTabPaper = styled(Paper)`
  position: relative;
  overflow: hidden;
  width: 20rem;
  height: 30rem;
  display: flex;
  flex-wrap: nowrap;
`

const StyledTabPanel = styled.div<{
  value: number
  index: number
}>`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: ${({ value, index }) => (index - value) * 20}rem;
  transition: left 0.5s ease-in-out;

  padding: 10px;
`

const StyledTabContent = muiStyled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  overflow: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}))

const TabPanel = ({ children, value, index }: { children: ReactNode, value: AuthTabs, index: AuthTabs }) => {
  return (
    <StyledTabPanel
      value={value}
      index={index}
    >
      <StyledTabContent>
        {children}
      </StyledTabContent>
    </StyledTabPanel>
  )
}