import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type { FeedbackRequest, FeedbackEntry } from "../types/feedback"

export class FeedbackService {
    async createFeedback(data: FeedbackRequest): Promise<ApiResponse<any>> {
        try {
            const formData = new FormData()
            formData.append('type', data.type)
            formData.append('message', data.message)
            formData.append('url', data.url)
            
            if (data.images && data.images.length > 0) {
                data.images.forEach((file) => {
                    formData.append('images[]', file)
                })
            }

            const response = await apiService.client.post<ApiResponse<any>>('/feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Gagal mengirim feedback')
        }
    }

    async getFeedback(params?: any): Promise<ApiResponse<FeedbackEntry[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<FeedbackEntry[]>>('/feedback', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Gagal mengambil data feedback')
        }
    }
}

export const feedbackService = new FeedbackService()
