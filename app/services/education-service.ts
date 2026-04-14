import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { EducationArticleResponse, EducationVideoResponse, EducationArticleDetailResponse, EducationVideoDetailResponse } from "../types/education"

export class EducationService {
    async getArticles(params: { categoryId?: number; isView?: string; page?: number; limit?: number; q?: string }): Promise<EducationArticleResponse> {
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

    async getVideos(params: { categoryId?: number; isView?: string; page?: number; limit?: number; q?: string }): Promise<EducationVideoResponse> {
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

    async getArticleById(id: number): Promise<EducationArticleDetailResponse> {
        try {
            const response = await apiService.client.get<EducationArticleDetailResponse>(`/education/article/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch education article details')
        }
    }

    async getVideoById(id: number): Promise<EducationVideoDetailResponse> {
        try {
            const response = await apiService.client.get<EducationVideoDetailResponse>(`/education/video/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch education video details')
        }
    }
}

export const educationService = new EducationService()
