import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
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
            return handleServiceError(error || 'Failed to fetch withdrawals')
        }
    }

    async createWithdraw(point: number): Promise<any> {
        try {
            const response = await apiService.client.post('/withdraw', { point }, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create withdrawal')
        }
    }

    getWithdrawPdfUrl(id: string | number): string {
        const config = useRuntimeConfig()
        const token = useAuth().state.token
        return `${config.public.apiUrl}/withdraw/${id}?token=${token}`
    }

    getWithdrawDownloadUrl(id: string | number): string {
        const config = useRuntimeConfig()
        const token = useAuth().state.token
        return `${config.public.apiUrl}/withdraw/${id}/download?token=${token}`
    }
}

export const withdrawService = new WithdrawService()
