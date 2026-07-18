import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type { NotificationListResponse, UnreadCountResponse } from "../types/notification"

export class NotificationService {
    async getNotifications(page = 1, limit = 10): Promise<NotificationListResponse> {
        try {
            const response = await apiService.client.get<NotificationListResponse>('/notification', {
                params: { page, limit },
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getUnreadCount(): Promise<UnreadCountResponse> {
        try {
            const response = await apiService.client.get<UnreadCountResponse>('/notification/unread-count', {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async markRead(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.patch<ApiResponse<null>>(`/notification/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async markAllRead(): Promise<ApiResponse<{ marked: number }>> {
        try {
            const response = await apiService.client.patch<ApiResponse<{ marked: number }>>('/notification/read-all', {}, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const notificationService = new NotificationService()
