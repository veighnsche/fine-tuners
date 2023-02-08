import { ReactNode, useEffect } from 'react'
import { useAppSelector } from '../store'
import { AuthStatus } from '../store/auth.slice'
import { useAuth } from './index'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(state => state.auth.status)
  const { initializeAuth } = useAuth()

  useEffect(() => {
    console.log('AuthWrapper useEffect', status)
    if (status === AuthStatus.UNINITIALIZED) {
      initializeAuth()
    }
  }, [status])

  return (
    <>
      {children}
    </>
  )
}