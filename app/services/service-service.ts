import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type { Service, ServiceListResponse, ServiceQueryParams, ServiceCustomerResponse, PromotionListResponse, PromotionQueryParams } from "../types/service"

export class ServiceService {
    async getServices(params?: ServiceQueryParams): Promise<ServiceListResponse> {
        try {
            const response = await apiService.client.get<ServiceListResponse>('/service', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch services')
        }
    }

    async getServiceByCode(code: string): Promise<ApiResponse<Service>> {
        try {
            const response = await apiService.client.get<ApiResponse<Service>>(`/service/${code}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch service detail')
        }
    }

    async getServiceCustomers(code: string, params?: ServiceQueryParams): Promise<ServiceCustomerResponse> {
        try {
            const response = await apiService.client.get<ServiceCustomerResponse>(`/service/${code}/customer`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch service customers')
        }
    }

    async getCustomerServices(params?: ServiceQueryParams): Promise<ServiceCustomerResponse> {
        try {
            const response = await apiService.client.get<ServiceCustomerResponse>('/customer-service', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch customer services')
        }
    }

    async getPromotions(params?: PromotionQueryParams): Promise<PromotionListResponse> {
        try {
            const response = await apiService.client.get<PromotionListResponse>('/service/promotion', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch promotions')
        }
    }

    async getPromotionDetail(id: number): Promise<ApiResponse<Promotion>> {
        try {
            const response = await apiService.client.get<ApiResponse<Promotion>>(`/service/promotion/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch promotion detail')
        }
    }

    async createPromotion(data: FormData): Promise<any> {
        try {
            const response = await apiService.client.post('/service/promotion', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create promotion')
        }
    }

    async updatePromotion(id: number, data: FormData): Promise<any> {
        try {
            const response = await apiService.client.put(`/service/promotion/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update promotion')
        }
    }

    async deletePromotion(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/service/promotion/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete promotion')
        }
    }
}

export const serviceService = new ServiceService()
