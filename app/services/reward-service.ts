import { apiService } from "./api-service"
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
            throw new Error(error.response?.data?.message || 'Failed to fetch rewards')
        }
    }
}

export const rewardService = new RewardService()
