import { ReactNode, useEffect } from 'react'
import { AuthStatus } from '../models/Auth'
import { useAppSelector } from '../store'
import { useAuth } from './index'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(state => state.auth.status)
  const { initializeAuth } = useAuth()

  useEffect(() => {
    console.log('AuthWrapper useEffect', status)
    if (status === AuthStatus.NOT_INITIALIZED) {
      initializeAuth()
    }
  }, [status])

  return (
    <>
      {children}
    </>
  )
}