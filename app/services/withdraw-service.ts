import { apiService } from "./api-service"
import type { WithdrawResponse, WithdrawQueryParams } from "../types/withdraw"

export class WithdrawService {
    async getWithdrawals(params?: WithdrawQueryParams): Promise<WithdrawResponse> {
        try {
            const response = await apiService.client.get<WithdrawResponse>('/withdraw', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch withdrawals')
        }
    }
}

export const withdrawService = new WithdrawService()
