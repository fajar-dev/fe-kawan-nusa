import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type {
    RateCommissionListResponse,
    RateCommissionDetailResponse,
    TakenServicesResponse,
    RateCommissionHistoryResponse,
    RateCommissionHistoryListResponse,
    RateCommissionCategory,
    RateCommissionValueType,
} from "../types/rate-commission"

export interface RateCommissionParams {
    page?: number
    limit?: number
    q?: string
    sort?: string
    order?: 'asc' | 'desc'
    category?: RateCommissionCategory
    type?: RateCommissionValueType
    startDateFrom?: string
    startDateTo?: string
}

export interface RateCommissionPayload {
    serviceCode?: string
    category?: RateCommissionCategory
    value?: number
    type?: RateCommissionValueType
    startDate?: string
    endDate?: string | null
    notes?: string | null
}

export class RateCommissionService {
    async getRateCommissions(params?: RateCommissionParams): Promise<RateCommissionListResponse> {
        try {
            const response = await apiService.client.get<RateCommissionListResponse>('/rate-commission', {
                params,
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch rate commissions')
        }
    }

    async getRateCommission(id: number): Promise<RateCommissionDetailResponse> {
        try {
            const response = await apiService.client.get<RateCommissionDetailResponse>(`/rate-commission/${id}`, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch rate commission')
        }
    }

    async getTakenServices(category: RateCommissionCategory): Promise<TakenServicesResponse> {
        try {
            const response = await apiService.client.get<TakenServicesResponse>('/rate-commission/taken-services', {
                params: { category },
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch taken services')
        }
    }

    async createRateCommission(data: RateCommissionPayload): Promise<RateCommissionDetailResponse> {
        try {
            const response = await apiService.client.post<RateCommissionDetailResponse>('/rate-commission', data, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create rate commission')
        }
    }

    async updateRateCommission(id: number, data: RateCommissionPayload): Promise<RateCommissionDetailResponse> {
        try {
            const response = await apiService.client.put<RateCommissionDetailResponse>(`/rate-commission/${id}`, data, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update rate commission')
        }
    }

    async getRateCommissionHistory(id: number): Promise<RateCommissionHistoryResponse> {
        try {
            const response = await apiService.client.get<RateCommissionHistoryResponse>(`/rate-commission/${id}/history`, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch rate commission history')
        }
    }

    async getAllRateCommissionHistories(params?: { page?: number; limit?: number; q?: string }): Promise<RateCommissionHistoryListResponse> {
        try {
            const response = await apiService.client.get<RateCommissionHistoryListResponse>('/rate-commission/histories', {
                params,
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch rate commission histories')
        }
    }

    async deleteRateCommission(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.delete<ApiResponse<null>>(`/rate-commission/${id}`, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete rate commission')
        }
    }
}

export const rateCommissionService = new RateCommissionService()
