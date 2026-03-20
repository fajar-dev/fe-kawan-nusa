import type { ApiResponse } from "./auth"

export interface Service {
  id: number
  code: string
  name: string
  description: string
  type: string
  isActive: boolean
  lastReferanceDate: string | null
  totalCustomerServices: number
  totalPoints: number
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  from: number
  to: number
}

export interface ServiceListResponse extends ApiResponse<Service[]> {
  meta: PaginationMeta
}

export interface ServiceQueryParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}
