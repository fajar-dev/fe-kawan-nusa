import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { CatalogCategoryResponse, CatalogResponse, CatalogDetailResponse } from "../types/catalog"

export class CatalogService {
    async getCategories(): Promise<CatalogCategoryResponse> {
        try {
            const response = await apiService.client.get<CatalogCategoryResponse>('/catalog/category', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch catalog categories')
        }
    }

    async getCatalogs(params: { categoryId?: number; page?: number; limit?: number }): Promise<CatalogResponse> {
        try {
            const response = await apiService.client.get<CatalogResponse>('/catalog', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch catalogs')
        }
    }

    async getCatalogById(id: number): Promise<CatalogDetailResponse> {
        try {
            const response = await apiService.client.get<CatalogDetailResponse>(`/catalog/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch catalog detail')
        }
    }
}

export const catalogService = new CatalogService()
