import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export interface Withdraw {
  id: number
  userId: number
  point: string
  bankName: string
  accountNumber: string
  accountHolderName: string
  payout: string
  tax: string
  createdAt: string
}

export interface WithdrawResponse extends ApiResponse<Withdraw[]> {
    meta: PaginationMeta
}

export interface WithdrawQueryParams {
  page?: number
  limit?: number
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
}
