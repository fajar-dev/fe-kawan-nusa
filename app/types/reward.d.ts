import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export interface CustomerReward {
  id: number
  customerServiceId: number
  price: number
  expiredDate: string
  point: number
  remainingPoint: number
  isExpired: boolean
  type: string
  customerService: {
    id: number
    serviceCode: string
    activationDate: string
    startDate: string
    endDate: string | null
  }
  service: {
    code: string
    name: string
  }
  customer: {
    id: string
    name: string
  }
  createdAt: string
}


export interface CustomerRewardResponse extends ApiResponse<CustomerReward[]> {
  meta: PaginationMeta
}

export interface RewardQueryParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  type?: string | string[]
}