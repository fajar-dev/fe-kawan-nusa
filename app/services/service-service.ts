import { apiService } from "./api-service"
import type { ApiResponse } from "../types/auth"
import type { Service, ServiceListResponse, ServiceQueryParams } from "../types/service"

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
            throw new Error(error.response?.data?.message || 'Failed to fetch services')
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
            throw new Error(error.response?.data?.message || 'Failed to fetch service detail')
        }
    }

    async getServiceCustomers(code: string, params?: ServiceQueryParams): Promise<any> {
        try {
            const response = await apiService.client.get<any>(`/service/${code}/customer`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch service customers')
        }
    }
}

export const serviceService = new ServiceService()
