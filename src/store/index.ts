import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from '../auth/auth.slice'
import appReducer from './app.slice'
import documentReducer from './document.slice'
import filesReducer from './files.slice'
import finetunesReducer from './finetunes.slice'
import linesReducer from './lines.slice'
import notificationsReducer from './notifications.slice'
import playgroundSettingsReducer from './playground.settings.slice'
import trainSettingsReducer from './train.settings.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    document: documentReducer,
    files: filesReducer,
    finetunes: finetunesReducer,
    lines: linesReducer,
    notifications: notificationsReducer,
    playgroundSettings: playgroundSettingsReducer,
    trainSettings: trainSettingsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
