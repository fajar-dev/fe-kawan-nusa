import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { UserListResponse, UserQueryParams, UserProfile, UserServiceQueryParams, UserStatisticResponse } from "../types/user"
import type { ApiResponse } from "../types/auth"
import type { ServiceCustomerResponse } from "../types/service"
import type { CustomerRewardResponse, RewardQueryParams } from "../types/reward"
import type { RedemptionResponse, RedemptionQueryParams } from "../types/redemption"

export class UserService {
    async getUsers(params?: UserQueryParams): Promise<UserListResponse> {
        try {
            const response = await apiService.client.get<UserListResponse>('/user', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch users')
        }
    }

    async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
        try {
            const response = await apiService.client.get<ApiResponse<UserProfile>>(`/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch user detail')
        }
    }

    async getUserServices(id: string, params?: UserServiceQueryParams): Promise<ServiceCustomerResponse> {
        try {
            const response = await apiService.client.get<ServiceCustomerResponse>(`/user/${id}/services`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch user services')
        }
    }

    async getUserRewards(id: string, params?: RewardQueryParams): Promise<CustomerRewardResponse> {
        try {
            const response = await apiService.client.get<CustomerRewardResponse>(`/user/${id}/reward`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch user rewards')
        }
    }

    async getUserRedemptions(id: string, params?: RedemptionQueryParams): Promise<RedemptionResponse> {
        try {
            const response = await apiService.client.get<RedemptionResponse>(`/user/${id}/redeem`, {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch user redemptions')
        }
    }

    async getUserStatistic(id: string): Promise<UserStatisticResponse> {
        try {
            const response = await apiService.client.get<UserStatisticResponse>(`/user/${id}/statistic`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch user statistic')
        }
    }
}

export const userService = new UserService()

