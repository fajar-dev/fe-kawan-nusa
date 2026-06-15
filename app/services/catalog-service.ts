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

    async getCatalogs(params: { 
        categoryId?: number | string | number[]; 
        categoryIds?: string | number[]; 
        type?: string | string[]; 
        types?: string | string[]; 
        page?: number; 
        limit?: number; 
        q?: string;
        sort?: string;
        order?: string;
    }): Promise<CatalogResponse> {
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

    async createCategory(name: string): Promise<any> {
        try {
            const response = await apiService.client.post('/catalog/category', { name }, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create catalog category')
        }
    }

    async updateCategory(id: number, name: string): Promise<any> {
        try {
            const response = await apiService.client.put(`/catalog/category/${id}`, { name }, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update catalog category')
        }
    }

    async deleteCategory(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/catalog/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete catalog category')
        }
    }

    async createCatalog(data: FormData): Promise<any> {
        try {
            const response = await apiService.client.post('/catalog', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create catalog')
        }
    }

    async updateCatalog(id: number, data: FormData): Promise<any> {
        try {
            const response = await apiService.client.put(`/catalog/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update catalog')
        }
    }

    async deleteCatalog(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/catalog/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete catalog')
        }
    }

    async uploadCatalogImage(file: File): Promise<any> {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await apiService.client.post('/catalog/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to upload catalog image')
        }
    }
}

export const catalogService = new CatalogService()
