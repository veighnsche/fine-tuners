import { Alert } from '@mui/material'
import { ComponentProps } from 'react'

export interface NotificationType {
  id: string
  message: string
  severity: ComponentProps<typeof Alert>['severity']
}