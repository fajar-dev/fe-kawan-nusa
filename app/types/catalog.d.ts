import type { ApiResponse } from "./auth"

export interface CatalogCategory {
    id: number
    name: string
}

export interface CatalogCreatedBy {
    id: number
    name: string
    employeeId: string
}

export interface CatalogItem {
    id: number
    categoryId: number
    name: string
    type: string
    description: string
    point: number
    image: string
    stock: number
    stockUsed: number
    expiredDate: string
    category: CatalogCategory
    createdBy: CatalogCreatedBy | null
}

export interface CatalogMeta {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    from: number
    to: number
}

export interface CatalogResponse extends ApiResponse<CatalogItem[]> {
    meta: CatalogMeta
}

export type CatalogCategoryResponse = ApiResponse<CatalogCategory[]>
export type CatalogDetailResponse = ApiResponse<CatalogItem>
