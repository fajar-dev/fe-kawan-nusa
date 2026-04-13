import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { EducationArticleResponse, EducationVideoResponse } from "../types/education"

export class EducationService {
    async getArticles(params: { categoryId?: number; isView?: string; page?: number; limit?: number; search?: string }): Promise<EducationArticleResponse> {
        try {
            const response = await apiService.client.get<EducationArticleResponse>('/education/article', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch education articles')
        }
    }

    async getVideos(params: { categoryId?: number; isView?: string; page?: number; limit?: number; search?: string }): Promise<EducationVideoResponse> {
        try {
            const response = await apiService.client.get<EducationVideoResponse>('/education/video', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch education videos')
        }
    }

    async getCategories(): Promise<{ success: boolean; data: { id: number; name: string }[] }> {
        try {
            const response = await apiService.client.get('/education/category', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch education categories')
        }
    }
}

export const educationService = new EducationService()
