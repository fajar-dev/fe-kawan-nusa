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
    isRecurring: boolean
    recurringEndDate: string | null
    notes: string | null
    user: { id: number; name: string } | null
    createdBy: { id: number; name: string } | null
    approvedBy: { id: number; name: string } | null
    approvedAt: string | null
    createdAt: string
}

export interface PointSubmissionResponse extends ApiResponse<PointSubmission[]> {
    meta: PaginationMeta
}

export type PointSubmissionDetailResponse = ApiResponse<PointSubmission>
export type NisAccountResponse = ApiResponse<NisAccount[]>
