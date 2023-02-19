import { ReactNode } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useOpenAI } from '../openAI'
import { useAppSelector } from '../store'
import { useAuth } from './auth.hook'
import { AuthStatus } from './auth.model'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(state => state.auth.status)
  const { initializeAuth } = useAuth()
  const { testAuth } = useOpenAI()

  useEffectOnce(() => {
    if (status === AuthStatus.NOT_INITIALIZED) {
      initializeAuth().then(async ({ status: postInitStatus, encryptedPassword, profile }) => {
        if (postInitStatus === AuthStatus.NO_PASSWORD_VERIFICATION) {
          await testAuth({ encryptedPassword, profile })
        }
      })
    }
  })

  return <>{children}</>
}