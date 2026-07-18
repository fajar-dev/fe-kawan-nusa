import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export type NotificationType = 'point' | 'redemption' | 'account' | 'content' | 'general'

export interface NotificationItem {
  id: number
  type: NotificationType
  title: string
  message: string
  link: string | null
  referenceId: number | null
  isBroadcast: boolean
  isRead: boolean
  createdAt: string
}

export interface NotificationListResponse extends ApiResponse<NotificationItem[]> {
  meta: PaginationMeta
}

export type UnreadCountResponse = ApiResponse<{ count: number }>
