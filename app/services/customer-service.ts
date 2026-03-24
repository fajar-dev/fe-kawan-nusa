import { apiService } from "./api-service"
import type { Customer, CustomerListResponse, CustomerQueryParams, CustomerAddressResponse, CustomerServiceResponse, CustomerRewardResponse } from "../types/customer"
import type { ApiResponse } from "../types/auth"

export class CustomerService {
    async getCustomers(params?: CustomerQueryParams): Promise<CustomerListResponse> {
        try {
            const response = await apiService.client.get<CustomerListResponse>('/customer', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
           handleServiceError(error || 'Failed to fetch customers')
        }
    }

    async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
        try {
            const response = await apiService.client.get<ApiResponse<Customer>>(`/customer/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
           handleServiceError(error || 'Failed to fetch customer detail')
        }
    }

    async getCustomerAddresses(id: string, params?: CustomerQueryParams): Promise<CustomerAddressResponse> {
        try {
            const response = await apiService.client.get<CustomerAddressResponse>(`/customer/${id}/address`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
           handleServiceError(error || 'Failed to fetch customer addresses')
        }
    }

    async getCustomerServices(id: string, params?: CustomerQueryParams): Promise<CustomerServiceResponse> {
        try {
            const response = await apiService.client.get<CustomerServiceResponse>(`/customer/${id}/service`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
           handleServiceError(error || 'Failed to fetch customer services')
        }
    }

    async getCustomerRewards(id: string, params?: CustomerQueryParams): Promise<CustomerRewardResponse> {
        try {
            const response = await apiService.client.get<CustomerRewardResponse>(`/customer/${id}/reward`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
           handleServiceError(error || 'Failed to fetch customer rewards')
        }
    }
}

export const customerService = new CustomerService()
