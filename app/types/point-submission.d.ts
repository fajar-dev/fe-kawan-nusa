import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export interface NisAccount {
    custServId: number
    custId: string
    accountName: string
    serviceCode: string
    serviceName: string
    accountManager: string | null
    salesEmployeeId: string | null
}

export interface PointSubmission {
    id: number
    type: 'OTC' | 'Bulanan'
    point: number
    price: number
    nisData: {
        custServId: number
        custId: string
        accountName: string
        serviceCode: string
        serviceName: string
        accountManager: string
        salesEmployeeId: string | null
    }
    status: 'pending' | 'approved' | 'rejected'
    scheduleId: number | null
    isAuto: boolean
    period: string | null
    notes: string | null
    user: { id: number; name: string } | null
    createdBy: { id: number; name: string } | null
    approvedBy: { id: number; name: string } | null
    approvedAt: string | null
    createdAt: string
}

export interface PointSubmissionSchedule {
    id: number
    price: number
    point: number
    anchorDay: number
    lastGeneratedPeriod: string
    isActive: boolean
    nisData: {
        custServId: number
        accountName: string
        [key: string]: any
    }
    user: { id: number; name: string } | null
    createdBy: { id: number; name: string } | null
    stoppedBy: { id: number; name: string } | null
    stoppedAt: string | null
    createdAt: string
}

export interface PointSubmissionScheduleResponse extends ApiResponse<PointSubmissionSchedule[]> {
    meta: PaginationMeta
}

export interface PointSubmissionResponse extends ApiResponse<PointSubmission[]> {
    meta: PaginationMeta
}

export type PointSubmissionDetailResponse = ApiResponse<PointSubmission>
export type NisAccountResponse = ApiResponse<NisAccount[]>
