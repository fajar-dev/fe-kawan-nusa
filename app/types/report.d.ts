import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export type ReportType = 'cash_redemption' | 'product_voucher_redemption' | 'referral_point' | 'point_balance'
export type ReportFormat = 'xlsx' | 'csv'
export type ReportDateBasis = 'submission' | 'completion'

export interface ReportColumn {
    header: string
    key: string
    width?: number
}

export interface ReportPreviewResponse extends ApiResponse<{
    columns: ReportColumn[]
    rows: Record<string, string | number | null>[]
    totalRows: number
    truncated: boolean
}> {}

export interface ReportDownloadHistory {
    id: number
    type: ReportType
    format: ReportFormat
    periodLabel: string
    filters: Record<string, unknown> | null
    requestedBy: { id: number; name: string } | null
    createdAt: string
}

export interface ReportDownloadHistoryListResponse extends ApiResponse<ReportDownloadHistory[]> {
    meta: PaginationMeta
}
