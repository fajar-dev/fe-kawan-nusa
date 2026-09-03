import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export type RateCommissionCategory = 'OTC' | 'Bulanan'
export type RateCommissionValueType = 'percentage' | 'flat'

export interface RateCommission {
    id: number
    category: RateCommissionCategory
    value: number
    type: RateCommissionValueType
    startDate: string
    endDate: string | null
    notes: string | null
    service: { code: string; name: string } | null
    createdBy: { id: number; name: string } | null
    createdAt: string
    updatedAt: string
}

export interface RateCommissionSubmitItem {
    category: RateCommissionCategory
    serviceCode?: string
    value: number
    type: RateCommissionValueType
    startDate: string
    endDate: string | null
    notes: string | null
}

export type RateCommissionHistoryAction = 'created' | 'updated'

export interface RateCommissionHistory {
    id: number
    action: RateCommissionHistoryAction
    category: RateCommissionCategory | null
    service: { code: string; name: string } | null
    fromValue: number | null
    toValue: number
    fromType: RateCommissionValueType | null
    toType: RateCommissionValueType
    fromStartDate: string | null
    toStartDate: string
    fromEndDate: string | null
    toEndDate: string | null
    notes: string | null
    changedBy: { id: number; name: string } | null
    createdAt: string
}

export interface RateCommissionListResponse extends ApiResponse<RateCommission[]> {
    meta: PaginationMeta
}

export interface RateCommissionHistoryListResponse extends ApiResponse<RateCommissionHistory[]> {
    meta: PaginationMeta
}

export type RateCommissionDetailResponse = ApiResponse<RateCommission>
export type TakenServicesResponse = ApiResponse<string[]>
export type RateCommissionHistoryResponse = ApiResponse<RateCommissionHistory[]>
