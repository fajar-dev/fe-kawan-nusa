import type { ApiResponse } from "./auth"

export interface ProductRedemptionRequest {
    catalogId: number
    address: string
}

export interface VoucherRedemptionRequest {
    catalogId: number
}

export interface RedemptionMeta {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    from: number
    to: number
}

export interface RedemptionData {
    id: number
    redempNo: string
    pointsUsed: number
    type: 'cash' | 'voucher' | 'product' | 'expired'
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'expired'
    notes: string | null
    withdrawDetails: {
        bankName: string
        accountNumber: string
        accountHolderName: string
        payout: number
        tax: number
    } | null
    voucherDetails: {
        catalog: {
            id: number
            name: string
            image: string
            category: {
                id: number
                name: string
            }
        }
        name: string
        email: string
        detail: {
            id: number
            code: string
            expiredDate: string
        } | null
    } | null
    productDetails: {
        catalog: {
            id: number
            name: string
            image: string
            category: {
                id: number
                name: string
            }
        }
        name: string
        email: string
        phone: string
        address: string
        shipping: {
            id: number
            shipper: string
            trackingNumber: string
            shippedAt: string
        } | null
    } | null
    createdAt: string
}

export interface CashRedemptionRequest {
    pointsUsed: number
}

export interface RedemptionQueryParams {
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
    q?: string
    type?: ('cash' | 'voucher' | 'product' | 'expired')[]
    status?: string[]
    startDate?: string
    endDate?: string
}

export interface ProductRedemptionResponse extends ApiResponse<RedemptionData> {}
export interface VoucherRedemptionResponse extends ApiResponse<RedemptionData> {}
export interface CashRedemptionResponse extends ApiResponse<RedemptionData> {}
export interface RedemptionResponse extends ApiResponse<RedemptionData[]> {
    meta: RedemptionMeta
}
