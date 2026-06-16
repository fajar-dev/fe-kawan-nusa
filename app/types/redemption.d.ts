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
        receipt: string
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

// Admin - Cash Redemption List
export interface CashRedemptionUser {
    id: number
    name: string
    photo: string | null
    email: string | null
    phone: string | null
    identityNumber: number | null
    taxNumber: string | null
}

export interface CashRedemptionListItem {
    id: number
    redempNo: string
    pointsUsed: number
    status: 'pending' | 'processing' | 'completed'
    notes: string | null
    user: CashRedemptionUser
    withdrawDetails: {
        bankName: string
        accountNumber: string
        accountHolderName: string
        payout: number
        tax: number
        receipt: string
    } | null
    createdAt: string
}

export interface CashRedemptionQueryParams {
    page?: number
    limit?: number
    q?: string
    sort?: string
    order?: 'asc' | 'desc'
    'status[]'?: string[]
    startDate?: string
    endDate?: string
}

export interface CashRedemptionListResponse extends ApiResponse<CashRedemptionListItem[]> {
    meta: RedemptionMeta
}

// Admin - Product Redemption List
export interface ProductRedemptionUser {
    id: number
    name: string
    photo: string | null
    email: string | null
    phone: string | null
}

export interface ProductRedemptionListItem {
    id: number
    redempNo: string
    pointsUsed: number
    status: 'pending' | 'processing' | 'completed'
    notes: string | null
    user: ProductRedemptionUser
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
    }
    createdAt: string
}

export interface ProductRedemptionQueryParams {
    page?: number
    limit?: number
    q?: string
    sort?: string
    order?: 'asc' | 'desc'
    'status[]'?: string[]
    startDate?: string
    endDate?: string
}

export interface ProductRedemptionListResponse extends ApiResponse<ProductRedemptionListItem[]> {
    meta: RedemptionMeta
}

export interface ProcessProductRequest {
    shipper: string
    trackingNumber: string
}

// Admin - Voucher Redemption List
export interface VoucherRedemptionUser {
    id: number
    name: string
    photo: string | null
    email: string | null
    phone: string | null
}

export interface VoucherRedemptionListItem {
    id: number
    redempNo: string
    pointsUsed: number
    status: 'pending' | 'processing' | 'completed'
    notes: string | null
    user: VoucherRedemptionUser
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
    }
    createdAt: string
}

export interface VoucherRedemptionQueryParams {
    page?: number
    limit?: number
    q?: string
    sort?: string
    order?: 'asc' | 'desc'
    'status[]'?: string[]
    startDate?: string
    endDate?: string
}

export interface VoucherRedemptionListResponse extends ApiResponse<VoucherRedemptionListItem[]> {
    meta: RedemptionMeta
}

export interface ProcessVoucherRequest {
    code: string
    expiredDate?: string
}
