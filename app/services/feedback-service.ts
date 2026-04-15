import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"

export interface FeedbackRequest {
  type: 'keluhan' | 'saran' | 'pujian'
  description: string
  images: File[]
}

export class FeedbackService {
    async createFeedback(data: FeedbackRequest): Promise<ApiResponse<any>> {
        try {
            const formData = new FormData()
            formData.append('type', data.type)
            formData.append('description', data.description)
            
            if (data.images && data.images.length > 0) {
                data.images.forEach((file) => {
                    formData.append('images[]', file)
                })
            }

            const response = await apiService.client.post<ApiResponse<any>>('/additional/feedback', formData, {
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
