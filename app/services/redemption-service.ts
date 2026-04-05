import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { CashRedemptionRequest, CashRedemptionResponse, ProductRedemptionRequest, ProductRedemptionResponse, VoucherRedemptionRequest, VoucherRedemptionResponse } from "../types/redemptions"

export class RedemptionService {
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
}

export const redemptionService = new RedemptionService()
