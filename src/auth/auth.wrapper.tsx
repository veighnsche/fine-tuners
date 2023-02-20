import { ReactNode } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useOpenAI } from '../hooks/openAI'
import { useAppSelector } from '../store'
import { useAuth } from './hooks'
import { AuthStatus } from './auth.model'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(state => state.auth.status)
  const { initializeAuth } = useAuth()
  const { verifyAuth } = useOpenAI()

  useEffectOnce(() => {
    if (status === AuthStatus.NOT_INITIALIZED) {
      initializeAuth().then(async ({ status: postInitStatus, encryptedPassword, profile }) => {
        if (postInitStatus === AuthStatus.NO_PASSWORD_VERIFICATION) {
          await verifyAuth({ encryptedPassword, profile })
        }
      })
    }
  })

  return <>{children}</>
}