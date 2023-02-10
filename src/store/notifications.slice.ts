import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { NotificationType } from '../models/Notification'
import { useAppDispatch } from './index'

interface NotificationsState {
  notifications: NotificationType[]
  shownNotifications: NotificationType['id'][]
}

const initialState: NotificationsState = {
  notifications: [],
  shownNotifications: [],
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<{
      notification: NotificationType
    }>) => {
      state.notifications.push(action.payload.notification)
      state.shownNotifications.push(action.payload.notification.id)
    },
    hideNotification: (state, action: PayloadAction<{
      id: NotificationType['id']
    }>) => {
      state.shownNotifications = state.shownNotifications.filter(
        (notificationId) => notificationId !== action.payload.id,
      )
    },
    removeNotification: (state, action: PayloadAction<{
      id: NotificationType['id']
    }>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload.id,
      )
    },
  },
})

export const {
  hideNotification,
  removeNotification,
} = notificationsSlice.actions

export function useAddNotification(): (notification: Omit<NotificationType, 'id'>) => void {
  const { addNotification } = notificationsSlice.actions
  const dispatch = useAppDispatch()

  return (notification: Omit<NotificationType, 'id'>) => {
    const id = uuid()
    dispatch(addNotification({ notification: { ...notification, id } }))
    setTimeout(() => {
      dispatch(hideNotification({ id }))
    }, 3000)
  }
}

export default notificationsSlice.reducer