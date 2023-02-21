import { ReactNode, useEffect } from 'react'
import { useOpenAI } from '../hooks/openAI'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useAppDispatch, useAppSelector } from '../store'
import { setFinetunes } from '../store/finetunes.slice'
import { AuthStatus } from './auth.model'
import { useAuth } from './hooks'

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(state => state.auth.status)
  const { initializeAuth } = useAuth()
  const { verifyAuth } = useOpenAI()
  const dispatch = useAppDispatch()
  const { fetchFinetunesList } = useOpenAI()

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
      fetchFinetunesList()
      .then((models) => {
        dispatch(setFinetunes({ finetunes: models.data }))
      })
    }
  }, [status])

  return <>{children}</>
}