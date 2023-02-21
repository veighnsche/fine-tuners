import { ReactNode, useEffect } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useOpenAI } from '../hooks/openAI'
import { useAppDispatch, useAppSelector } from '../store'
import { setFineTunes } from '../store/fineTunes.slice'
import { useAuth } from './hooks'
import { AuthStatus } from './auth.model'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(state => state.auth.status)
  const { initializeAuth } = useAuth()
  const { verifyAuth } = useOpenAI()
  const dispatch = useAppDispatch()
  const { fetchFineTunesList } = useOpenAI()

  useEffectOnce(() => {
    if (status === AuthStatus.NOT_INITIALIZED) {
      initializeAuth().then(async ({ status: postInitStatus, encryptedPassword, profile }) => {
        if (postInitStatus === AuthStatus.NO_PASSWORD_VERIFICATION) {
          await verifyAuth({ encryptedPassword, profile })
        }
      })
    }
  })

  useEffect(() => {
    if (status === AuthStatus.PASSWORD_VERIFIED) {
      fetchFineTunesList()
      .then((models) => {
        dispatch(setFineTunes({ fineTunes: models.data }))
      })
    }
  }, [status])

  return <>{children}</>
}