import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { CashRedemptionRequest, CashRedemptionResponse, ProductRedemptionRequest, ProductRedemptionResponse, VoucherRedemptionRequest, VoucherRedemptionResponse, RedemptionQueryParams, RedemptionResponse, CashRedemptionQueryParams, CashRedemptionListResponse, ProductRedemptionQueryParams, ProductRedemptionListResponse, ProcessProductRequest, VoucherRedemptionQueryParams, VoucherRedemptionListResponse, ProcessVoucherRequest } from "../types/redemption"

export class RedemptionService {
    async getRedemptions(params?: RedemptionQueryParams): Promise<RedemptionResponse> {
        try {
            const response = await apiService.client.get<RedemptionResponse>('/redemption', {
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
            const response = await apiService.client.post<ProductRedemptionResponse>('/redemption/product', data, {
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
            const response = await apiService.client.post<VoucherRedemptionResponse>('/redemption/voucher', data, {
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
            const response = await apiService.client.post<CashRedemptionResponse>('/redemption/cash', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to redeem cash')
        }
    }

    async getCashRedemptions(params?: CashRedemptionQueryParams): Promise<CashRedemptionListResponse> {
        try {
            const response = await apiService.client.get<CashRedemptionListResponse>('/redemption/cash/list', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch cash redemptions')
        }
    }

    async completeCash(id: string | number): Promise<any> {
        try {
            const response = await apiService.client.put<any>(`/redemption/cash/list/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to complete cash redemption')
        }
    }

    // Admin - Product Redemption
    async getProductRedemptions(params?: ProductRedemptionQueryParams): Promise<ProductRedemptionListResponse> {
        try {
            const response = await apiService.client.get<ProductRedemptionListResponse>('/redemption/product/list', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch product redemptions')
        }
    }

    async processProduct(id: string | number, data: ProcessProductRequest): Promise<any> {
        try {
            const response = await apiService.client.post<any>(`/redemption/product/list/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to process product redemption')
        }
    }

    async completeProduct(id: string | number): Promise<any> {
        try {
            const response = await apiService.client.put<any>(`/redemption/product/list/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to complete product redemption')
        }
    }

    // Admin - Voucher Redemption
    async getVoucherRedemptions(params?: VoucherRedemptionQueryParams): Promise<VoucherRedemptionListResponse> {
        try {
            const response = await apiService.client.get<VoucherRedemptionListResponse>('/redemption/voucher/list', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch voucher redemptions')
        }
    }

    async processVoucher(id: string | number, data: ProcessVoucherRequest): Promise<any> {
        try {
            const response = await apiService.client.post<any>(`/redemption/voucher/list/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to process voucher redemption')
        }
    }

    async completeVoucher(id: string | number): Promise<any> {
        try {
            const response = await apiService.client.put<any>(`/redemption/voucher/list/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to complete voucher redemption')
        }
    }

    async downloadReceipt(url: string | null | undefined): Promise<void> {
        if (!url) return
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            
            let filename = 'bukti-transfer'
            try {
                const parsedUrl = new URL(url)
                const pathname = parsedUrl.pathname
                const parts = pathname.split('/')
                const lastPart = parts[parts.length - 1]
                if (lastPart) {
                    filename = decodeURIComponent(lastPart)
                }
            } catch (e) {
                // Ignore
            }

            const link = document.createElement('a')
            link.href = blobUrl
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Failed to download receipt:', error)
            window.open(url, '_blank')
        }
    }
}

export const redemptionService = new RedemptionService()
