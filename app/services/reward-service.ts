import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { CustomerRewardResponse, CustomerQueryParams } from "../types/customer"

export class RewardService {
    async getRewards(params?: CustomerQueryParams): Promise<CustomerRewardResponse> {
        try {
            const response = await apiService.client.get<CustomerRewardResponse>('/reward', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch rewards')
        }
    }
}

export const rewardService = new RewardService()
