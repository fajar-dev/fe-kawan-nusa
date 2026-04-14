import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { TemplateListResponse, TemplateQueryParams } from "../types/template"

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
}

export const templateService = new TemplateService()
