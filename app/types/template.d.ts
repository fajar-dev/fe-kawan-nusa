import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./service"

export interface MarketingTemplate {
  id: number
  name: string
  description: string
  thumbnail: string
  png: string | null
  jpg: string | null
  psd: string | null
  mp4: string | null
  isActive: boolean
  createdAt: string
}

export interface TemplateListResponse extends ApiResponse<MarketingTemplate[]> {
  meta: PaginationMeta
}

export interface TemplateQueryParams {
  q?: string
  page?: number
  limit?: number
}
