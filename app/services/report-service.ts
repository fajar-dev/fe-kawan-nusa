import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type {
    ReportPreviewResponse,
    ReportDownloadHistoryListResponse,
    ReportType,
    ReportFormat,
    ReportDateBasis,
} from "../types/report"

export interface ReportFilterParams {
    type: ReportType
    format?: ReportFormat
    dateFrom?: string
    dateTo?: string
    snapshotDate?: string
    basis?: ReportDateBasis
    branchCode?: string
    serviceCode?: string
    statuses?: string[]
    includeSummary?: boolean
    maskSensitive?: boolean
}

const paramsSerializer = (params: Record<string, any>) => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue
        if (Array.isArray(value)) {
            value.forEach(v => search.append(`${key}[]`, String(v)))
        } else {
            search.append(key, String(value))
        }
    }
    return search.toString()
}

export class ReportService {
    async getPreview(params: ReportFilterParams): Promise<ReportPreviewResponse> {
        try {
            const response = await apiService.client.get<ReportPreviewResponse>('/report/preview', {
                params,
                paramsSerializer,
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch report preview')
        }
    }

    async downloadReport(params: ReportFilterParams): Promise<{ blob: Blob; filename: string }> {
        try {
            const response = await apiService.client.get('/report/download', {
                params,
                paramsSerializer,
                responseType: 'blob',
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })

            const disposition = response.headers['content-disposition'] as string | undefined
            const match = disposition?.match(/filename="?([^"]+)"?/)
            const filename = match?.[1] || `laporan.${params.format || 'xlsx'}`

            return { blob: response.data as Blob, filename }
        } catch (error: any) {
            if (error?.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text()
                    error.response.data = JSON.parse(text)
                } catch {
                    // leave as-is if the error body isn't JSON
                }
            }
            return handleServiceError(error || 'Failed to download report')
        }
    }

    async getDownloadHistories(params?: { page?: number; limit?: number; q?: string }): Promise<ReportDownloadHistoryListResponse> {
        try {
            const response = await apiService.client.get<ReportDownloadHistoryListResponse>('/report/histories', {
                params,
                headers: { Authorization: `Bearer ${useAuth().state.token}` }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch report download histories')
        }
    }
}

export const reportService = new ReportService()
