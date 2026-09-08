import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export type PointAdjustmentStatus = 'pending_approval' | 'needs_revision' | 'approved_pending_credit' | 'completed'
export type PointAdjustmentAction = 'submitted' | 'returned_for_revision' | 'resubmitted' | 'approved' | 'credited'
export type PointAdjustmentTab = 'menunggu_sm' | 'perlu_revisi' | 'diproses' | 'selesai'

export interface EligiblePointSubmission {
    id: number
    accountName: string
    custId: string
    serviceName: string
    type: 'OTC' | 'Bulanan'
    branchName: string | null
    currentValue: number
    currentPoint: number
}

export interface PointAdjustmentHistoryEntry {
    id: number
    action: PointAdjustmentAction
    note: string | null
    actor: { id: number; name: string } | null
    createdAt: string
}

export interface PointAdjustment {
    id: number
    code: string
    status: PointAdjustmentStatus
    fromValue: number
    toValue: number
    fromPoint: number
    toPoint: number
    reason: string
    reviewNote: string | null
    pointSubmission: {
        id: number
        accountName: string
        custId: string
        serviceName: string
        type: 'OTC' | 'Bulanan'
    } | null
    branchName: string | null
    requestedBy: { id: number; name: string } | null
    approver: { id: number; name: string } | null
    histories: PointAdjustmentHistoryEntry[]
    createdAt: string
    updatedAt: string
}

export interface PointAdjustmentCounts {
    menunggu_sm: number
    perlu_revisi: number
    diproses: number
    selesai: number
}

export type EligibleSubmissionsResponse = ApiResponse<EligiblePointSubmission[]>
export type PointAdjustmentCountsResponse = ApiResponse<PointAdjustmentCounts>
export type PointAdjustmentDetailResponse = ApiResponse<PointAdjustment>

export interface PointAdjustmentListResponse extends ApiResponse<PointAdjustment[]> {
    meta: PaginationMeta
}
