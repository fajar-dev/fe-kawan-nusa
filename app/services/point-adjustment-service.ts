import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type {
    EligibleSubmissionsResponse,
    PointAdjustmentCountsResponse,
    PointAdjustmentListResponse,
    PointAdjustmentDetailResponse,
    PointAdjustmentTab,
} from "../types/point-adjustment"

export interface PointAdjustmentListParams {
    page?: number
    limit?: number
    q?: string
    tab?: PointAdjustmentTab
}

export class PointAdjustmentService {
    async getEligibleSubmissions(): Promise<EligibleSubmissionsResponse> {
        try {
            const response = await apiService.client.get<EligibleSubmissionsResponse>('/point-adjustment/eligible-submissions', {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch eligible submissions')
        }
    }

    async getCounts(): Promise<PointAdjustmentCountsResponse> {
        try {
            const response = await apiService.client.get<PointAdjustmentCountsResponse>('/point-adjustment/counts', {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch point adjustment counts')
        }
    }

    async getList(params?: PointAdjustmentListParams): Promise<PointAdjustmentListResponse> {
        try {
            const response = await apiService.client.get<PointAdjustmentListResponse>('/point-adjustment', {
                params,
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch point adjustments')
        }
    }

    async getById(id: number): Promise<PointAdjustmentDetailResponse> {
        try {
            const response = await apiService.client.get<PointAdjustmentDetailResponse>(`/point-adjustment/${id}`, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch point adjustment')
        }
    }

    async create(data: { pointSubmissionId: number; toValue: number; reason: string }): Promise<PointAdjustmentDetailResponse> {
        try {
            const response = await apiService.client.post<PointAdjustmentDetailResponse>('/point-adjustment', data, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to submit point adjustment')
        }
    }

    async review(id: number, action: 'approve' | 'reject', note?: string): Promise<PointAdjustmentDetailResponse> {
        try {
            const response = await apiService.client.patch<PointAdjustmentDetailResponse>(`/point-adjustment/${id}/review`, { action, note }, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to review point adjustment')
        }
    }

    async resubmit(id: number, data: { toValue: number; reason: string }): Promise<PointAdjustmentDetailResponse> {
        try {
            const response = await apiService.client.patch<PointAdjustmentDetailResponse>(`/point-adjustment/${id}/resubmit`, data, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to resubmit point adjustment')
        }
    }
}

export const pointAdjustmentService = new PointAdjustmentService()
