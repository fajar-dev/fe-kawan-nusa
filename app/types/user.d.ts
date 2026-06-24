import type { ApiResponse } from "./auth"
import type { PaginationMeta } from "./customer"
import type { CustomerRewardResponse, RewardQueryParams } from "./reward"
import type { RedemptionResponse, RedemptionQueryParams } from "./redemption"
import type { StatisticCount, MonthPointStatistic, CustomerStatistic, RedemptionRewardStatistic } from "./statistic"

export interface UserBankInfo {
  holderName: string | null
  name: string | null
  number: string | null
  accountPath: string | null
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

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  photo: string | null
  email: string
  phone: string | null
  identityNumber: number | null
  taxNumber: string | null
  company: string | null
  jobPosition: string | null
  birthDate: string | null
  birthPlace: string | null
  address: string | null
  companyAddress: string | null
  identityPath: string | null
  bankDetails: UserBankInfo | null
  settings: {
    isSubscribe: boolean
    isAutoWithdraw: boolean
  } | null
  isActive: boolean
  passwordUpdatedAt: string | null
  createdAt: string
}

export interface UserQueryParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  isActive?: number
}

export interface UserServiceQueryParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}

export interface UserListResponse extends ApiResponse<UserListItem[]> {
  meta: PaginationMeta
}

export interface UserStatisticData {
  count: StatisticCount
  pointPerMonth: MonthPointStatistic[]
  customerStats: CustomerStatistic[]
  redemptionRewardStats: RedemptionRewardStatistic[]
}

export type UserStatisticResponse = ApiResponse<UserStatisticData>

