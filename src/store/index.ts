import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from '../auth/auth.slice'
import dialogsReducer from './dialogs.slice'
import documentReducer from './document.slice'
import filesReducer from './files.slice'
import linesReducer from './lines.slice'
import notificationsReducer from './notifications.slice'
import playgroundSettingsReducer from './playground.settings.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dialogs: dialogsReducer,
    document: documentReducer,
    files: filesReducer,
    lines: linesReducer,
    notifications: notificationsReducer,
    playgroundSettings: playgroundSettingsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
