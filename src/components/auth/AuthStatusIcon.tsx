import styled from '@emotion/styled'
import KeyIcon from '@mui/icons-material/Key'
import LockOpenIcon from '@mui/icons-material/LockOpenOutlined'
import LockIcon from '@mui/icons-material/LockOutlined'
import { Box } from '@mui/material'
import { AuthStatus } from '../../models/Auth'
import { useAppSelector } from '../../store'

/**
 * 0s Key and lock in place
 * 1s Key moves to lock
 * 2s Key pivots and fades out
 * 3s Lock transforms into lock open
 * 4s Lock open fades out to the right
 */

const KeyAnimation = styled(Box)`
  animation: key 3s ease-in-out;
  animation-fill-mode: forwards;

  @keyframes key {
    0% {
      width: 20px;
      transform: skew(0deg);
      opacity: 1;
    }
    25% {
      width: 10px;
      transform: skew(0deg);
      opacity: 1;
    }
    50% {
      width: 10px;
      transform: skewX(-25deg);
      opacity: 1;
    }
    75% {
      width: 10px;
      transform: skewX(-25deg);
      opacity: 0;
    }
    100% {
      width: 0;
      transform: skewX(-25deg);
      opacity: 0;
    }
  }
`
const LockAnimation = styled(Box)`
  width: 0;

  animation: lock 3s ease-in-out;
  animation-fill-mode: forwards;

  @keyframes lock {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
`
const LockOpenAnimation = styled(Box)`
  animation: lock-open 3s ease-in-out;
  animation-fill-mode: forwards;

  @keyframes lock-open {
    0% {
      width: 20px;
      opacity: 0;
    }
    25% {
      width: 20px;
      opacity: 0;
    }
    50% {
      width: 20px;
      opacity: 1;
    }
    75% {
      width: 20px;
      opacity: 1;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
`

const KeyEnteringAnimation = styled(Box)`
  animation: key-entering 400ms ease-in-out;
  animation-fill-mode: forwards;

  @keyframes key-entering {
    0% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: 20px;
      opacity: 1;
    }
  }
`

const LockEnteringAnimation = styled(Box)`
  animation: lock-entering 1s ease-in-out;
  animation-fill-mode: forwards;

  @keyframes lock-entering {
    0% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: 20px;
      opacity: 1;
    }
  }
`

export const AuthStatusIcon = () => {
  const status = useAppSelector(state => state.auth.status)
  const noPasswordVerification = status === AuthStatus.NO_PASSWORD_VERIFICATION

  if (
    status === AuthStatus.PASSWORD_REQUIRED
    || status === AuthStatus.NO_PASSWORD
    || noPasswordVerification
  ) {
    return (
      <Box display="flex" alignItems="center">
        {noPasswordVerification ? (
          <KeyEnteringAnimation display="flex" alignItems="center">
            <KeyIcon fontSize="small"/>
          </KeyEnteringAnimation>
        ) : null}
        <LockEnteringAnimation display="flex" alignItems="center">
          <LockIcon fontSize="small"/>
        </LockEnteringAnimation>
      </Box>
    )
  }

  if (status === AuthStatus.PASSWORD_VERIFIED) {
    return (
      <Box display="flex" alignItems="center">
        <KeyAnimation display="flex" alignItems="center">
          <KeyIcon fontSize="small"/>
        </KeyAnimation>
        <LockAnimation display="flex" alignItems="center">
          <LockIcon fontSize="small"/>
        </LockAnimation>
        <LockOpenAnimation display="flex" alignItems="center">
          <LockOpenIcon fontSize="small"/>
        </LockOpenAnimation>
      </Box>
    )
  }

  return null
}