import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type { StatisticCount, MonthPointStatistic, CustomerStatistic } from "../types/statistic"

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
            return handleServiceError(error || 'Failed to fetch statistic count')
        }
    }

    async getPointStatistic(): Promise<ApiResponse<MonthPointStatistic[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<MonthPointStatistic[]>>('/statistic/point', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch point statistic')
        }
    }

    async getCustomerStatistic(type: 'monthly' | 'yearly'): Promise<ApiResponse<CustomerStatistic[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<CustomerStatistic[]>>('/statistic/customer', {
                params: { type },
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch customer statistic')
        }
    }
}

export const statisticService = new StatisticService()
