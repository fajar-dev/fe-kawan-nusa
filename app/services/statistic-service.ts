import { apiService } from "./api-service"
import type { ApiResponse } from "../types/auth"
import type { StatisticCount } from "../types/statistic"

export class StatisticService {
    async getCount(): Promise<ApiResponse<StatisticCount>> {
        try {
            const response = await apiService.client.get<ApiResponse<StatisticCount>>('/statistic/count', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch statistic count')
        }
    }
}

export const statisticService = new StatisticService()
