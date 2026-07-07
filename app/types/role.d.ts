import type { ApiResponse } from './auth'
import type { PaginationMeta } from './customer'

export interface PermissionModule {
    key: string
    label: string
    group: string
    actions: string[]
}

export interface RoleEmployee {
    id: number
    name: string
    email: string
    photo: string | null
    roleId: number | null
}

export interface RoleItem {
    id: number
    name: string
    description: string | null
    color: string | null
    permissions: Record<string, string[]>
    isDefault: boolean
    employeeCount: number
    employees?: RoleEmployee[]
    createdAt: string
    updatedAt: string
}

export interface RoleListResponse extends ApiResponse<RoleItem[]> {
    meta: PaginationMeta
}

export interface EmployeeRole {
    id: number
    name: string
    color: string | null
}
