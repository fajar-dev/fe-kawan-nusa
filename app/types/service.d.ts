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
  totalPoint: number
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

export interface ServiceCustomer {
  id: number
  customerId: string
  serviceCode: string
  registrationDate: string
  activationDate: string
  startDate: string
  endDate: string | null
  status: string
  referenceDate: string
  salesName: string
  service: {
    code: string
    name: string
    type: string
  }
  totalPoint: number
  latestReward: {
    point: number
    type: string
    createdAt: string
  } | null
}

export interface ServiceCustomerResponse extends ApiResponse<ServiceCustomer[]> {
  meta: PaginationMeta
}
