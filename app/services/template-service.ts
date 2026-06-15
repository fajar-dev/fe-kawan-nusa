import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { TemplateListResponse, TemplateDetailResponse, TemplateQueryParams } from "../types/template"

export class TemplateService {
    async getTemplates(params?: TemplateQueryParams): Promise<TemplateListResponse> {
        try {
            const response = await apiService.client.get<TemplateListResponse>('/template', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch templates')
        }
    }

    async getTemplateDetail(id: number): Promise<TemplateDetailResponse> {
        try {
            const response = await apiService.client.get<TemplateDetailResponse>(`/template/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch template detail')
        }
    }

    getDownloadUrl(id: number, type: string): string {
        const token = useAuth().state.token
        const baseUrl = useRuntimeConfig().public.apiUrl
        return `${baseUrl}/template/${id}/download?type=${type}&token=${token}`
    }

    async createTemplate(data: FormData): Promise<any> {
        try {
            const response = await apiService.client.post('/template', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create template')
        }
    }

    async updateTemplate(id: number, data: FormData): Promise<any> {
        try {
            const response = await apiService.client.put(`/template/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update template')
        }
    }

    async deleteTemplate(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/template/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete template')
        }
    }
}

export const templateService = new TemplateService()
