import type { ApiResponse } from "./auth"

export interface ProductRedemptionRequest {
    catalogId: number
    address: string
}

export interface VoucherRedemptionRequest {
    catalogId: number
}

export interface RedemptionData {
    id: number
    redempNo: string
    pointsUsed: number
    type: string
    status: string
    notes: string | null
    withdrawDetails: any | null
    voucherDetails: any | null
    productDetails: any | null
    createdAt: string
}

export interface CashRedemptionRequest {
    pointsUsed: number
}

export interface ProductRedemptionResponse extends ApiResponse<RedemptionData> {}
export interface VoucherRedemptionResponse extends ApiResponse<RedemptionData> {}
export interface CashRedemptionResponse extends ApiResponse<RedemptionData> {}
