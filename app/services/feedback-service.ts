import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"

export interface FeedbackRequest {
  url: string
  type: 'keluhan' | 'saran' | 'pujian'
  message: string
  images: File[]
}

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
}

export const feedbackService = new FeedbackService()
