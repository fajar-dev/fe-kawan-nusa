import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type { Service, ServiceListResponse, ServiceQueryParams, ServiceCustomerResponse } from "../types/service"

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
}

export const serviceService = new ServiceService()
