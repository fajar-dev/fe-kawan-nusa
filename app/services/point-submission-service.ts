import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { PointSubmissionResponse, PointSubmissionDetailResponse, NisAccountResponse, PointSubmissionScheduleResponse, PointSubmissionSchedule } from "../types/point-submission"
import type { ApiResponse } from "../types/auth"

export interface PointSubmissionParams {
    page?: number
    limit?: number
    q?: string
    sort?: string
    order?: 'asc' | 'desc'
    status?: 'pending' | 'approved'
    type?: string
    startDate?: string
    endDate?: string
}

export class PointSubmissionService {
    async getSubmissions(params?: PointSubmissionParams): Promise<PointSubmissionResponse> {
        try {
            const response = await apiService.client.get<PointSubmissionResponse>('/point-submission', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch point submissions')
        }
    }

    async createSubmission(data: any): Promise<PointSubmissionDetailResponse> {
        try {
            const response = await apiService.client.post<PointSubmissionDetailResponse>('/point-submission', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create point submission')
        }
    }

    async updateSubmission(id: number, data: any): Promise<PointSubmissionDetailResponse> {
        try {
            const response = await apiService.client.put<PointSubmissionDetailResponse>(`/point-submission/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update point submission')
        }
    }

    async deleteSubmission(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.delete<ApiResponse<null>>(`/point-submission/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete point submission')
        }
    }

    async approveSubmissions(ids: number[], notes?: string): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.post<ApiResponse<null>>('/point-submission/approve', { ids, notes }, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to approve point submissions')
        }
    }

    async getSchedules(params?: { page?: number; limit?: number; isActive?: boolean }): Promise<PointSubmissionScheduleResponse> {
        try {
            const response = await apiService.client.get<PointSubmissionScheduleResponse>('/point-submission/schedule', {
                params,
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch schedules')
        }
    }

    async adjustSchedule(id: number, price: number): Promise<ApiResponse<PointSubmissionSchedule>> {
        try {
            const response = await apiService.client.patch<ApiResponse<PointSubmissionSchedule>>(`/point-submission/schedule/${id}`, { price }, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to adjust schedule')
        }
    }

    async stopSchedule(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.patch<ApiResponse<null>>(`/point-submission/schedule/${id}/stop`, {}, {
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to stop schedule')
        }
    }

    async searchNisAccounts(q: string): Promise<NisAccountResponse> {
        try {
            const response = await apiService.client.get<NisAccountResponse>('/nis/account', {
                params: { q },
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to search NIS accounts')
        }
    }

    async checkAccount(custServId: number, userId: number, excludeId?: number): Promise<{ existsForUser: boolean; existsForOthers: boolean }> {
        try {
            const response = await apiService.client.get<ApiResponse<{ existsForUser: boolean; existsForOthers: boolean }>>('/point-submission/check-account', {
                params: { custServId, userId, excludeId },
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data.data
        } catch (error: any) {
            return { existsForUser: false, existsForOthers: false }
        }
    }
}

export const pointSubmissionService = new PointSubmissionService()
