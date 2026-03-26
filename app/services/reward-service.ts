import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { CustomerRewardResponse, RewardQueryParams } from "../types/reward"

export class RewardService {
    async getRewards(params?: RewardQueryParams): Promise<CustomerRewardResponse> {
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
