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
    type: 'cash' | 'voucher' | 'product'
    status: 'pending' | 'processing' | 'completed'
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
        }
        name: string
        email: string
    } | null
    productDetails: {
        catalog: {
            id: number
            name: string
            image: string
        }
        name: string
        email: string
        phone: string
        address: string
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
    type?: ('cash' | 'voucher' | 'product')[]
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
