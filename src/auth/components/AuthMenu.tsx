import styled from '@emotion/styled'
import { Box, Grow, Paper, Popper } from '@mui/material'
import { styled as muiStyled } from '@mui/material/styles'
import { ReactNode, useEffect, useState } from 'react'
import { AuthStatus, ProfileType } from '../auth.model'
import { useAppDispatch, useAppSelector } from '../../store'
import { clearCreatingProfileVehicle } from '../auth.slice'
import { AuthCreatePassword } from './AuthCreatePassword'
import { AuthCreateProfile } from './AuthCreateProfile'
import { AuthEnterPassword } from './AuthEnterPassword'
import { AuthForgotPassword } from './AuthForgotPassword'
import { AuthProfile } from './AuthProfile'
import { AuthProfiles } from './AuthProfiles'
import { AuthRemoveProfile } from './AuthRemoveProfile'

const StyledTabPaper = styled(Paper)`
  position: relative;
  overflow: hidden;
  width: 24rem;
  height: 32rem;
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
  left: ${({ value, index }) => (index - value) * 24}rem;
  transition: left 0.4s ease-in-out;

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

interface TopBarMenuProps {
  anchorEl: HTMLElement
  open: boolean
  setOpen: (open: boolean) => void
  onClose: () => void
}

enum AuthTabs {
  FORGOT_PASSWORD,
  CREATE_PROFILE,
  CREATE_PASSWORD,
  PROFILES,
  PROFILE,
  ENTER_PASSWORD,
  CONFIRM_REMOVE_PROFILE,
}

export const AuthMenu = ({ anchorEl, open, setOpen, onClose }: TopBarMenuProps) => {
  const dispatch = useAppDispatch()
  const currentProfile = useAppSelector(state => state.auth.profile)
  const status = useAppSelector(state => state.auth.status)
  const [tab, setTab] = useState(AuthTabs.PROFILES)
  const [profile, setProfile] = useState<ProfileType | undefined>()

  useEffect(() => {
    if (status === AuthStatus.NO_PROFILE_CREATED) {
      setTab(AuthTabs.CREATE_PROFILE)
    }
    if (status === AuthStatus.PASSWORD_REQUIRED) {
      if (currentProfile) {
        setProfile(currentProfile)
        setTab(AuthTabs.ENTER_PASSWORD)
      } else {
        setTab(AuthTabs.PROFILES)
      }
      setOpen(true)
    }
    if (status === AuthStatus.PROFILE_REQUIRED) {
      setTab(AuthTabs.CREATE_PROFILE)
      setOpen(true)
    }
  }, [status])

  useEffect(() => {
    if (tab === AuthTabs.PROFILES) {
      setTimeout(() => {
        setProfile(undefined)
      }, 400)
    }
  }, [tab])

  useEffect(() => {
    if (!open) {
      if (status === AuthStatus.NO_PROFILE_CREATED) {
        setTab(AuthTabs.CREATE_PROFILE)
      } else {
        setTab(AuthTabs.PROFILES)
      }
    }
  }, [open])

  const handleClose = () => {
    setTab(AuthTabs.PROFILES)
    onClose()
  }

  return (
    <Popper
      anchorEl={anchorEl}
      open
      placement="bottom-end"
    >
      <Grow in={open} unmountOnExit>
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
              onSubmitClick={() => {
                dispatch(clearCreatingProfileVehicle())
                setTab(AuthTabs.PROFILES)
              }}
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
              onUseClick={() => setTab(AuthTabs.ENTER_PASSWORD)}
              onBackClick={() => setTab(AuthTabs.PROFILES)}
              onRemoveClick={() => setTab(AuthTabs.CONFIRM_REMOVE_PROFILE)}
            />
          </TabPanel>

          <TabPanel value={tab} index={AuthTabs.ENTER_PASSWORD}>
            <AuthEnterPassword
              profile={profile}
              onBackClick={() => setTab(AuthTabs.PROFILES)}
              onForgotPasswordClick={() => setTab(AuthTabs.FORGOT_PASSWORD)}
              onSubmitClick={handleClose}
            />
          </TabPanel>

          <TabPanel value={tab} index={AuthTabs.FORGOT_PASSWORD}>
            <AuthForgotPassword
              onCreateProfileClick={() => setTab(AuthTabs.CREATE_PROFILE)}
              onBackClick={() => setTab(AuthTabs.PROFILES)}
            />
          </TabPanel>

          <TabPanel value={tab} index={AuthTabs.CONFIRM_REMOVE_PROFILE}>
            <AuthRemoveProfile
              profile={profile}
              onBackClick={() => setTab(AuthTabs.PROFILE)}
              onRemoveClick={() => setTab(AuthTabs.PROFILES)}
            />
          </TabPanel>
        </StyledTabPaper>
      </Grow>
    </Popper>
  )
}