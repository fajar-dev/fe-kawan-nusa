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

    async createCategory(name: string): Promise<any> {
        try {
            const response = await apiService.client.post('/education/category', { name }, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create category')
        }
    }

    async updateCategory(id: number, name: string): Promise<any> {
        try {
            const response = await apiService.client.put(`/education/category/${id}`, { name }, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update category')
        }
    }

    async deleteCategory(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/education/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete category')
        }
    }

    async createArticle(data: FormData): Promise<any> {
        try {
            const response = await apiService.client.post('/education/article', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create article')
        }
    }

    async updateArticle(id: number, data: FormData): Promise<any> {
        try {
            const response = await apiService.client.put(`/education/article/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update article')
        }
    }

    async deleteArticle(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/education/article/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete article')
        }
    }

    async uploadArticleImage(file: File): Promise<any> {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await apiService.client.post('/education/article/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to upload image')
        }
    }

    async createVideo(data: FormData): Promise<any> {
        try {
            const response = await apiService.client.post('/education/video', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create video')
        }
    }

    async updateVideo(id: number, data: FormData): Promise<any> {
        try {
            const response = await apiService.client.put(`/education/video/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update video')
        }
    }

    async deleteVideo(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/education/video/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete video')
        }
    }
}

export const educationService = new EducationService()
