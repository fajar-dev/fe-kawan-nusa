import type { ApiResponse } from "./auth"

export interface CustomerPhone {
  id: number
  phone: string
  label: string | null
}

export interface CustomerEmail {
  id: number
  email: string
  label: string | null
}

export interface Customer {
  id: string
  name: string
  company: string | null
  type: string | null
  registrationDate: string | null
  isActive: boolean
  totalCustomerServices?: number
  latestCustomerService?: CustomerRegisteredService
  phones: CustomerPhone[]
  emails: CustomerEmail[]
  addresses: CustomerAddress[]
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  from: number
  to: number
}

export interface CustomerListResponse extends ApiResponse<Customer[]> {
  meta: PaginationMeta
}

export interface CustomerAddressResponse extends ApiResponse<CustomerAddress[]> {
  meta: PaginationMeta
}

export interface CustomerQueryParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  isActive?: number
  type?: string | string[]
  serviceCode?: string | string[]
}

export interface CustomerRegisteredService {
  id: number
  customerId: string
  serviceCode: string
  registrationDate: string
  activationDate: string
  startDate: string
  endDate: string | null
  status: string
  referenceDate: string
  salesName: string | null
  address: string | null
  service: {
    code: string
    name: string
    type: string
  }
}

export interface CustomerServiceResponse extends ApiResponse<CustomerRegisteredService[]> {
  meta: PaginationMeta
}

