import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { CashRedemptionRequest, CashRedemptionResponse, ProductRedemptionRequest, ProductRedemptionResponse, VoucherRedemptionRequest, VoucherRedemptionResponse, RedemptionQueryParams, RedemptionResponse } from "../types/redemptions"

export class RedemptionService {
    async getRedemptions(params?: RedemptionQueryParams): Promise<RedemptionResponse> {
        try {
            const response = await apiService.client.get<RedemptionResponse>('/redemptions', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch redemptions')
        }
    }

    async redeemProduct(data: ProductRedemptionRequest): Promise<ProductRedemptionResponse> {
        try {
            const response = await apiService.client.post<ProductRedemptionResponse>('/redemptions/product', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to redeem product')
        }
    }

    async redeemVoucher(data: VoucherRedemptionRequest): Promise<VoucherRedemptionResponse> {
        try {
            const response = await apiService.client.post<VoucherRedemptionResponse>('/redemptions/voucher', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to redeem voucher')
        }
    }

    async redeemCash(data: CashRedemptionRequest): Promise<CashRedemptionResponse> {
        try {
            const response = await apiService.client.post<CashRedemptionResponse>('/redemptions/cash', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to redeem cash')
        }
    }

    getWithdrawPdfUrl(id: string | number): string {
        const config = useRuntimeConfig()
        const token = useAuth().state.token
        return `${config.public.apiUrl}/redemptions/${id}/receipt?token=${token}`
    }

    getWithdrawDownloadUrl(id: string | number): string {
        const config = useRuntimeConfig()
        const token = useAuth().state.token
        return `${config.public.apiUrl}/redemptions/${id}/receipt/download?token=${token}`
    }
}

export const redemptionService = new RedemptionService()
