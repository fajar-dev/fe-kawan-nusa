import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"

export interface UserBankInfo {
  holderName: string | null
  name: string | null
  number: string | null
}

export interface UserListItem {
  id: number
  name: string
  photo: string | null
  email: string
  phone: string | null
  identityNumber: number | null
  taxNumber: string | null
  isActive: boolean
  lastReferanceDate: string | null
  point: number
  bank: UserBankInfo | null
}

export interface UserQueryParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  isActive?: number
}

export interface UserListResponse extends ApiResponse<UserListItem[]> {
  meta: PaginationMeta
}
