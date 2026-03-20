import { apiService } from "./api-service"
import type { Customer, CustomerListResponse, CustomerQueryParams, CustomerAddressResponse } from "../types/customer"
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
            throw new Error(error.response?.data?.message || 'Failed to fetch customers')
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
            throw new Error(error.response?.data?.message || 'Failed to fetch customer detail')
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
            throw new Error(error.response?.data?.message || 'Failed to fetch customer addresses')
        }
    }
}

export const customerService = new CustomerService()
